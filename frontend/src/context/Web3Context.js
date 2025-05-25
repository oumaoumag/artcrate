import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS, NETWORKS } from '../config/contracts';
import ArtPlatformABI from '../abi/ArtPlatform.json';

const Web3Context = createContext();

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0');
    const [tokenBalance, setTokenBalance] = useState('0');
    const [isConnecting, setIsConnecting] = useState(false);
    const [mintedNFTs, setMintedNFTs] = useState([]);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    // Initialize provider on component mount
    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);

            // Check if already connected
            checkConnection();

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    // Check if wallet is already connected
    const checkConnection = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    };

    // Handle account changes
    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            // User disconnected
            setAccount(null);
            setBalance('0');
            setTokenBalance('0');
            setContract(null);
            setSigner(null);
        } else {
            // Account changed
            connectWallet();
        }
    };

    // Handle chain changes
    const handleChainChanged = (chainId) => {
        setChainId(chainId);
        checkNetwork(chainId);
        // Reload the page to reset the dapp state
        window.location.reload();
    };

    // Check if on correct network
    const checkNetwork = (currentChainId) => {
        const targetChainId = NETWORKS.LISK_SEPOLIA.chainId;
        setIsCorrectNetwork(currentChainId === targetChainId);
    };

    // Switch to Lisk Sepolia network
    const switchToLiskSepolia = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.LISK_SEPOLIA.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.LISK_SEPOLIA],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    throw addError;
                }
            } else {
                console.error('Error switching network:', switchError);
                throw switchError;
            }
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask to use this application');
            return;
        }

        setIsConnecting(true);

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const web3Signer = web3Provider.getSigner();
            const address = await web3Signer.getAddress();

            // Get current chain ID
            const network = await web3Provider.getNetwork();
            const currentChainId = `0x${network.chainId.toString(16)}`;

            setChainId(currentChainId);
            checkNetwork(currentChainId);

            // If not on correct network, try to switch
            if (currentChainId !== NETWORKS.LISK_SEPOLIA.chainId) {
                await switchToLiskSepolia();
                return; // Will reload page after network switch
            }

            // Get ETH balance
            const ethBalance = await web3Provider.getBalance(address);
            const formattedBalance = ethers.utils.formatEther(ethBalance);

            // Initialize contract
            const artPlatformContract = new ethers.Contract(
                CONTRACTS.ART_PLATFORM,
                ArtPlatformABI.abi,
                web3Signer
            );

            // Get token balance
            let tokenBal = '0';
            try {
                const tokenBalanceBN = await artPlatformContract.tokenBalanceOf(address);
                tokenBal = ethers.utils.formatEther(tokenBalanceBN);
            } catch (error) {
                console.warn('Error fetching token balance:', error);
            }

            // Update state
            setAccount(address);
            setBalance(parseFloat(formattedBalance).toFixed(4));
            setTokenBalance(parseFloat(tokenBal).toFixed(2));
            setContract(artPlatformContract);
            setProvider(web3Provider);
            setSigner(web3Signer);

            // Load user's NFTs
            await loadUserNFTs(artPlatformContract, address);

        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert(`Failed to connect wallet: ${error.message}`);
        } finally {
            setIsConnecting(false);
        }
    };

    // Load user's NFTs from the contract
    const loadUserNFTs = async (contractInstance, userAddress) => {
        try {
            const nftBalance = await contractInstance.nftBalanceOf(userAddress);
            const nfts = [];

            for (let i = 0; i < nftBalance.toNumber(); i++) {
                try {
                    const tokenId = await contractInstance.tokenOfOwnerByIndex(userAddress, i);
                    const tokenURI = await contractInstance.tokenURI(tokenId);
                    const creator = await contractInstance.creators(tokenId);

                    // Fetch metadata from IPFS
                    let metadata = {};
                    try {
                        const response = await fetch(tokenURI);
                        metadata = await response.json();
                    } catch (metadataError) {
                        console.warn('Error fetching metadata for token', tokenId, metadataError);
                        metadata = {
                            name: `NFT #${tokenId}`,
                            description: 'Metadata unavailable',
                            image: '',
                        };
                    }

                    nfts.push({
                        id: tokenId.toString(),
                        title: metadata.name || `NFT #${tokenId}`,
                        description: metadata.description || '',
                        image: metadata.image || '',
                        creator: creator,
                        tokenURI: tokenURI,
                        timestamp: new Date().toISOString(), // We don't have exact timestamp from contract
                        reward: 10, // Default reward amount
                    });
                } catch (tokenError) {
                    console.warn('Error loading token at index', i, tokenError);
                }
            }

            setMintedNFTs(nfts);
        } catch (error) {
            console.error('Error loading user NFTs:', error);
        }
    };

    // Mint NFT function
    const mintNFT = async (metadataURI) => {
        if (!contract || !account) {
            throw new Error('Wallet not connected or contract not initialized');
        }

        try {
            const tx = await contract.mintNFT(metadataURI);
            const receipt = await tx.wait();

            // Update token balance after successful mint
            const newTokenBalance = await contract.tokenBalanceOf(account);
            setTokenBalance(ethers.utils.formatEther(newTokenBalance));

            // Reload NFTs
            await loadUserNFTs(contract, account);

            return receipt;
        } catch (error) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    };

    // Transfer tokens function
    const transferTokens = async (to, amount) => {
        if (!contract || !account) {
            throw new Error('Wallet not connected or contract not initialized');
        }

      try {
          const amountWei = ethers.utils.parseEther(amount.toString());
          const tx = await contract.tokenTransfer(to, amountWei);
          const receipt = await tx.wait();

          // Update token balance after successful transfer
          const newTokenBalance = await contract.tokenBalanceOf(account);
          setTokenBalance(ethers.utils.formatEther(newTokenBalance));

          return receipt;
      } catch (error) {
          console.error('Error transferring tokens:', error);
          throw error;
    }
    };

    // Get contract info
    const getContractInfo = async () => {
        if (!contract) return null;

        try {
            const [
                nftName,
                nftSymbol,
                tokenName,
                tokenSymbol,
                totalNFTSupply,
                totalTokenSupply,
                rewardAmount,
                maxNFTSupply,
                maxTokenSupply,
            ] = await Promise.all([
                contract.nftName(),
                contract.nftSymbol(),
                contract.tokenName(),
                contract.tokenSymbol(),
                contract.nftTotalSupply(),
                contract.tokenTotalSupply(),
                contract.rewardAmount(),
                contract.MAX_NFT_SUPPLY(),
                contract.MAX_TOKEN_SUPPLY(),
            ]);

        return {
            nft: {
                name: nftName,
                symbol: nftSymbol,
                totalSupply: totalNFTSupply.toString(),
                maxSupply: maxNFTSupply.toString(),
            },
            token: {
                name: tokenName,
                symbol: tokenSymbol,
                totalSupply: ethers.utils.formatEther(totalTokenSupply),
                maxSupply: ethers.utils.formatEther(maxTokenSupply),
            },
            rewardAmount: ethers.utils.formatEther(rewardAmount),
        };
    } catch (error) {
        console.error('Error getting contract info:', error);
        return null;
    }
    };

    // Add minted NFT to local state (for immediate UI update)
    const addMintedNFT = (nft) => {
        setMintedNFTs(prev => [nft, ...prev]);
        // Update token balance optimistically
        setTokenBalance(prev => (parseFloat(prev) + 10).toString());
    };

    const value = {
        // State
        account,
        balance,
        tokenBalance,
        isConnecting,
        mintedNFTs,
        contract,
        provider,
        signer,
        chainId,
        isCorrectNetwork,

        // Functions
        connectWallet,
        switchToLiskSepolia,
        mintNFT,
        transferTokens,
        getContractInfo,
        addMintedNFT,
        loadUserNFTs,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};