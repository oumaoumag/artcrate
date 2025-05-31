import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

    // Check if on correct network
    const checkNetwork = useCallback((currentChainId) => {
        const targetChainId = NETWORKS.LISK_SEPOLIA.chainId;
        setIsCorrectNetwork(currentChainId === targetChainId);
    }, []);

    // Memoize the connectWallet function
    const connectWallet = useCallback(async () => {
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
    }, [checkNetwork]);

    // Switch to Lisk Sepolia network
    const switchToLiskSepolia = useCallback(async () => {
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
    }, []);

    // Memoize the checkConnection function
    const checkConnection = useCallback(async () => {
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
    }, [connectWallet]);

    // Memoize the handleAccountsChanged function
    const handleAccountsChanged = useCallback((accounts) => {
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
    }, [connectWallet]);

    // Memoize the handleChainChanged function
    const handleChainChanged = useCallback((chainId) => {
        setChainId(chainId);
        checkNetwork(chainId);
        window.location.reload();
    }, [checkNetwork]);

    // Initialize provider on component mount with proper dependencies
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
    }, [checkConnection, handleAccountsChanged, handleChainChanged]);

    // Load user's NFTs from localStorage and contract
    const loadUserNFTs = useCallback(async (contractInstance, userAddress) => {
        console.log('Starting NFT load from contract');
        try {
            // First check if we have any individually stored NFTs (fallback storage)
            const individualNFTs = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('nft_')) {
                    try {
                        const nftData = JSON.parse(localStorage.getItem(key));
                        if (nftData && nftData.id) {
                            individualNFTs.push(nftData);
                            console.log(`Found individually stored NFT: ${nftData.id}`);
                        }
                    } catch (e) {
                        console.warn(`Failed to parse individually stored NFT: ${key}`, e);
                    }
                }
            }
            
            // Load from localStorage for immediate display
            let localNFTs = [];
            try {
                localNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
                console.log('Loaded NFTs from localStorage:', localNFTs.length);
                
                // Merge with individual NFTs if any
                if (individualNFTs.length > 0) {
                    const mergedNFTs = [...localNFTs];
                    for (const nft of individualNFTs) {
                        if (!mergedNFTs.some(existing => existing.id === nft.id)) {
                            mergedNFTs.push(nft);
                        }
                    }
                    localNFTs = mergedNFTs;
                    console.log('Merged with individual NFTs, new total:', localNFTs.length);
                }
                
                if (localNFTs.length > 0) {
                    setMintedNFTs(localNFTs);
                }
            } catch (e) {
                console.error('Error parsing localStorage NFTs:', e);
                // If main storage fails but we have individual NFTs, use those
                if (individualNFTs.length > 0) {
                    localNFTs = individualNFTs;
                    setMintedNFTs(individualNFTs);
                    console.log('Using individually stored NFTs as fallback');
                }
            }

            // Load from contract for verification
            const nftBalance = await contractInstance.nftBalanceOf(userAddress);
            console.log('NFT balance from contract:', nftBalance.toString());
            const nfts = [];

            // Limit to a reasonable number to prevent quota issues
            const maxItems = Math.min(nftBalance.toNumber(), 50); // Increased to 50

            for (let i = 0; i < maxItems; i++) {
                try {
                    const tokenId = await contractInstance.tokenOfOwnerByIndex(userAddress, i);
                    console.log(`Loading token #${i}: ID ${tokenId.toString()}`);
                    const tokenURI = await contractInstance.tokenURI(tokenId);
                    const creator = await contractInstance.creators(tokenId);

                    // Check if we already have this NFT in local storage
                    const localNFT = localNFTs.find(nft => nft.id === tokenId.toString());
                    if (localNFT) {
                        console.log(`Using cached data for token ${tokenId.toString()}`);
                        nfts.push(localNFT);
                        continue;
                    }

                    console.log(`Fetching metadata for token ${tokenId.toString()} from URI: ${tokenURI}`);
                    let metadata = {};
                    try {
                        // Try to parse base64 encoded metadata
                        if (tokenURI.startsWith('data:application/json;base64,')) {
                            const base64Data = tokenURI.split(',')[1];
                            const jsonString = atob(base64Data);
                            metadata = JSON.parse(jsonString);
                            console.log(`Parsed base64 metadata for token ${tokenId.toString()}:`, metadata);
                        } 
                        // Try to get from IPFS hash in localStorage
                        else {
                            const hashMatch = tokenURI.match(/Qm[a-zA-Z0-9]+/);
                            if (hashMatch) {
                                const hash = hashMatch[0];
                                const stored = localStorage.getItem(`metadata_${hash}`);
                                if (stored) {
                                    metadata = JSON.parse(stored);
                                    console.log(`Retrieved metadata from localStorage for hash ${hash}`);
                                } else {
                                    console.log(`No cached metadata found for hash ${hash}`);
                                    metadata = {
                                        name: `NFT #${tokenId}`,
                                        description: 'IPFS metadata (not cached)',
                                        image: '',
                                    };
                                }
                            } else {
                                console.log(`No IPFS hash found in URI: ${tokenURI}`);
                                metadata = {
                                    name: `NFT #${tokenId}`,
                                    description: tokenURI,
                                    image: '',
                                };
                            }
                        }
                    } catch (metadataError) {
                        console.error('Error fetching metadata for token', tokenId, metadataError);
                        metadata = {
                            name: `NFT #${tokenId}`,
                            description: 'Metadata unavailable',
                            image: '',
                        };
                    }

                    // Process image URL if needed
                    let imageUrl = metadata.image || '';
                    if (imageUrl.startsWith('ipfs://')) {
                        imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
                    }

                    const nftData = {
                        id: tokenId.toString(),
                        title: metadata.name || `NFT #${tokenId}`,
                        description: metadata.description || '',
                        image: imageUrl,
                        creator: creator,
                        owner: userAddress, // Explicitly set owner to current user
                        tokenURI: tokenURI,
                        timestamp: new Date().toISOString(),
                        reward: 10,
                    };

                    console.log(`Created NFT data for token ${tokenId.toString()}:`, nftData);
                    nfts.push(nftData);
                    
                    // Store this NFT individually as a backup
                    try {
                        localStorage.setItem(`nft_${tokenId}`, JSON.stringify(nftData));
                    } catch (e) {
                        console.warn(`Failed to store individual NFT ${tokenId}`, e);
                    }
                } catch (tokenError) {
                    console.error('Error loading token at index', i, tokenError);
                }
            }

            console.log('Processed NFTs:', nfts.length);
            
            if (nfts.length > 0) {
                // Store in localStorage
                try {
                    localStorage.setItem('userNFTs', JSON.stringify(nfts));
                    console.log('Updated localStorage with NFTs');
                } catch (storageError) {
                    console.error('Failed to update localStorage:', storageError);
                    // Try to clear and store fewer items
                    try {
                        localStorage.removeItem('userNFTs');
                        localStorage.setItem('userNFTs', JSON.stringify(nfts.slice(0, 3)));
                        console.log('Stored reduced set of NFTs in localStorage');
                    } catch (fallbackError) {
                        console.error('Fallback storage also failed:', fallbackError);
                    }
                }
                
                // Update state with the NFTs we found
                setMintedNFTs(nfts);
            }
        } catch (error) {
            console.error('Error loading user NFTs:', error);
        }
    }, []);

    // Mint NFT function
    const mintNFT = async (metadataURI) => {
        if (!contract || !account) {
            throw new Error('Wallet not connected or contract not initialized');
        }

        try {
            // Try minting with minimal gas settings - let MetaMask handle gas price
            const tx = await contract.mintNFT(metadataURI, {
                gasLimit: 300000, // Conservative gas limit
            });
            console.log("Minting transaction sent:", tx.hash);
            const receipt = await tx.wait();
            console.log("Minting transaction confirmed:", receipt);

            // Get the token ID from the event
            const event = receipt.events?.find(e => e.event === 'Transfer');
            console.log("Transfer event:", event);
            
            let tokenId;
            if (event && event.args) {
                tokenId = event.args.tokenId || event.args[2]; // Try both named and positional args
                console.log("Token ID from event:", tokenId.toString());
            } else {
                // Fallback: try to get the latest token ID
                const nftBalance = await contract.nftBalanceOf(account);
                if (nftBalance.gt(0)) {
                    tokenId = await contract.tokenOfOwnerByIndex(account, nftBalance.sub(1));
                    console.log("Token ID from balance check:", tokenId.toString());
                }
            }

            if (tokenId) {
                // Parse and store the metadata
                try {
                    let metadata = {};
                    
                    // First try to parse from the URI directly if it's base64 encoded
                    if (metadataURI.startsWith('data:application/json;base64,')) {
                        const base64Data = metadataURI.split(',')[1];
                        const jsonString = atob(base64Data);
                        metadata = JSON.parse(jsonString);
                        console.log("Parsed metadata from base64:", metadata);
                    } else {
                        // Try to get metadata from localStorage using the URI hash
                        const hashMatch = metadataURI.match(/Qm[a-zA-Z0-9]+/);
                        if (hashMatch) {
                            const hash = hashMatch[0];
                            const stored = localStorage.getItem(`metadata_${hash}`);
                            if (stored) {
                                metadata = JSON.parse(stored);
                                console.log("Retrieved metadata from localStorage:", metadata);
                            }
                        }
                    }

                    // Store NFT locally for immediate display
                    const nftData = storeNFTLocally(tokenId, metadata, account);
                    console.log("Stored NFT locally:", nftData);
                    
                    // Force update the mintedNFTs state
                    setMintedNFTs(prev => {
                        const updated = [nftData, ...prev.filter(nft => nft.id !== tokenId.toString())];
                        console.log("Updated mintedNFTs state:", updated);
                        return updated;
                    });
                } catch (metadataError) {
                    console.error('Could not get metadata for immediate display:', metadataError);
                }
            } else {
                console.error("Failed to get token ID from transaction");
            }

            // Update token balance after successful mint
            const newTokenBalance = await contract.tokenBalanceOf(account);
            setTokenBalance(ethers.utils.formatEther(newTokenBalance));

            // Reload NFTs (this will merge with localStorage data)
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

    // Transfer NFT function
    const transferNFT = async (to, tokenId) => {
        if (!contract || !account) {
            throw new Error('Wallet not connected or contract not initialized');
        }

        try {
            // Call the transferFrom function on the NFT contract
            const tx = await contract.transferFrom(account, to, tokenId, {
                gasLimit: 200000,
            });
            const receipt = await tx.wait();

            // Update NFTs after transfer
            await loadUserNFTs(contract, account);

            return receipt;
        } catch (error) {
            console.error('Error transferring NFT:', error);
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

    // Store NFT data locally for immediate display
    const storeNFTLocally = (tokenId, metadata, creator) => {
        console.log("Storing NFT locally with metadata:", metadata);
        
        // Handle different image URL formats
        let imageUrl = '';
        if (metadata.image) {
            imageUrl = metadata.image;
            // If it's an IPFS hash without the full URL, add the gateway prefix
            if (imageUrl.startsWith('ipfs://')) {
                imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
        }

        // Store metadata by IPFS hash for future reference
        const hashMatch = imageUrl.match(/Qm[a-zA-Z0-9]+/) || (metadata.image && metadata.image.match(/Qm[a-zA-Z0-9]+/));
        if (hashMatch) {
            const hash = hashMatch[0];
            localStorage.setItem(`metadata_${hash}`, JSON.stringify(metadata));
            console.log(`Stored metadata for hash ${hash} in localStorage`);
        }

        const nftData = {
            id: tokenId.toString(),
            title: metadata.name || `NFT #${tokenId}`,
            description: metadata.description || '',
            image: imageUrl,
            creator: creator,
            owner: creator, // Set owner to creator for newly minted NFTs
            timestamp: new Date().toISOString(),
            reward: 10,
        };

        console.log("Created NFT data object:", nftData);

        // Update localStorage
        try {
            const existingNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
            const updatedNFTs = [nftData, ...existingNFTs.filter(nft => nft.id !== tokenId.toString())];
            localStorage.setItem('userNFTs', JSON.stringify(updatedNFTs));
            console.log("Updated localStorage with new NFT data");
        } catch (error) {
            console.error("Error updating localStorage:", error);
            // Fallback: try to store just this NFT
            try {
                localStorage.setItem(`nft_${tokenId}`, JSON.stringify(nftData));
                console.log(`Stored NFT ${tokenId} in separate localStorage item`);
            } catch (fallbackError) {
                console.error("Fallback storage also failed:", fallbackError);
            }
        }

        return nftData;
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
        transferNFT,
        getContractInfo,
        addMintedNFT,
        storeNFTLocally,
        loadUserNFTs,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};
