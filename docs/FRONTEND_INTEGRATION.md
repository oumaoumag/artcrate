# Frontend Integration Guide

## Overview

This guide provides comprehensive instructions for integrating the ArtPlatform smart contract with a React frontend, addressing the unique considerations of our single-contract architecture.

## Contract Interface

### ABI Highlights

```javascript
const ArtPlatformABI = [
    // NFT Functions (Standard ERC721)
    "function mintNFT(string memory metadataURI) external",
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function nftBalanceOf(address owner) external view returns (uint256)",
    "function nftTotalSupply() external view returns (uint256)",
    
    // Token Functions (Custom Implementation)
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    
    // Platform Functions
    "function rewardAmount() external view returns (uint256)",
    "function creators(uint256 tokenId) external view returns (address)",
    
    // Events
    "event NFTMinted(address indexed creator, uint256 indexed tokenId, string uri)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
```

## React Integration

### 1. Contract Service Setup

```javascript
// services/ArtPlatformService.js
import { ethers } from 'ethers';
import ArtPlatformABI from '../abis/ArtPlatform.json';

class ArtPlatformService {
    constructor(contractAddress, provider) {
        this.contractAddress = contractAddress;
        this.provider = provider;
        this.contract = new ethers.Contract(contractAddress, ArtPlatformABI, provider);
    }

    // Connect with signer for write operations
    connect(signer) {
        this.signer = signer;
        this.contractWithSigner = this.contract.connect(signer);
        return this;
    }

    // NFT Operations
    async mintNFT(metadataURI) {
        if (!this.contractWithSigner) throw new Error('Signer required');
        
        const tx = await this.contractWithSigner.mintNFT(metadataURI);
        return await tx.wait();
    }

    async getNFTMetadata(tokenId) {
        const uri = await this.contract.tokenURI(tokenId);
        // Fetch metadata from IPFS
        const response = await fetch(uri);
        return await response.json();
    }

    async getUserNFTs(userAddress) {
        const balance = await this.contract.nftBalanceOf(userAddress);
        const nfts = [];
        
        for (let i = 0; i < balance; i++) {
            const tokenId = await this.contract.tokenOfOwnerByIndex(userAddress, i);
            const metadata = await this.getNFTMetadata(tokenId);
            const creator = await this.contract.creators(tokenId);
            
            nfts.push({
                tokenId: tokenId.toString(),
                metadata,
                creator
            });
        }
        
        return nfts;
    }

    // Token Operations
    async getTokenBalance(address) {
        const balance = await this.contract.balanceOf(address);
        return ethers.formatEther(balance);
    }

    async transferTokens(to, amount) {
        if (!this.contractWithSigner) throw new Error('Signer required');
        
        const amountWei = ethers.parseEther(amount.toString());
        const tx = await this.contractWithSigner.transfer(to, amountWei);
        return await tx.wait();
    }

    async approveTokens(spender, amount) {
        if (!this.contractWithSigner) throw new Error('Signer required');
        
        const amountWei = ethers.parseEther(amount.toString());
        const tx = await this.contractWithSigner.approve(spender, amountWei);
        return await tx.wait();
    }

    // Platform Information
    async getRewardAmount() {
        const reward = await this.contract.rewardAmount();
        return ethers.formatEther(reward);
    }

    async getTotalSupply() {
        const supply = await this.contract.totalSupply();
        return ethers.formatEther(supply);
    }

    async getTokenInfo() {
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            this.contract.name(),
            this.contract.symbol(),
            this.contract.decimals(),
            this.contract.totalSupply()
        ]);

        return {
            name,
            symbol,
            decimals,
            totalSupply: ethers.formatEther(totalSupply)
        };
    }

    // Event Listeners
    onNFTMinted(callback) {
        this.contract.on('NFTMinted', (creator, tokenId, uri, event) => {
            callback({
                creator,
                tokenId: tokenId.toString(),
                uri,
                transactionHash: event.transactionHash
            });
        });
    }

    onTokenTransfer(callback) {
        this.contract.on('Transfer', (from, to, amount, event) => {
            callback({
                from,
                to,
                amount: ethers.formatEther(amount),
                transactionHash: event.transactionHash,
                isReward: from === '0x0000000000000000000000000000000000000000'
            });
        });
    }

    // Cleanup
    removeAllListeners() {
        this.contract.removeAllListeners();
    }
}

export default ArtPlatformService;
```

### 2. React Hooks

```javascript
// hooks/useArtPlatform.js
import { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import ArtPlatformService from '../services/ArtPlatformService';

export const useArtPlatform = () => {
    const { provider, signer, account } = useContext(Web3Context);
    const [artPlatform, setArtPlatform] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (provider) {
            const service = new ArtPlatformService(
                process.env.REACT_APP_CONTRACT_ADDRESS,
                provider
            );
            
            if (signer) {
                service.connect(signer);
            }
            
            setArtPlatform(service);
        }
    }, [provider, signer]);

    const mintNFT = async (metadataURI) => {
        if (!artPlatform) throw new Error('Contract not initialized');
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await artPlatform.mintNFT(metadataURI);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTokenBalance = async (address = account) => {
        if (!artPlatform || !address) return '0';
        
        try {
            return await artPlatform.getTokenBalance(address);
        } catch (err) {
            console.error('Error fetching token balance:', err);
            return '0';
        }
    };

    return {
        artPlatform,
        mintNFT,
        getTokenBalance,
        loading,
        error
    };
};
```

### 3. Component Examples

#### NFT Minting Component
```javascript
// components/NFTMinter.jsx
import React, { useState } from 'react';
import { useArtPlatform } from '../hooks/useArtPlatform';
import { uploadToIPFS } from '../services/ipfsService';

const NFTMinter = () => {
    const { mintNFT, loading, error } = useArtPlatform();
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState({
        name: '',
        description: '',
        attributes: []
    });

    const handleMint = async () => {
        try {
            // Upload file to IPFS
            const imageURI = await uploadToIPFS(file);
            
            // Create metadata
            const metadataObject = {
                ...metadata,
                image: imageURI
            };
            
            // Upload metadata to IPFS
            const metadataURI = await uploadToIPFS(
                new Blob([JSON.stringify(metadataObject)], { type: 'application/json' })
            );
            
            // Mint NFT
            const result = await mintNFT(metadataURI);
            
            console.log('NFT minted successfully:', result);
            
            // Reset form
            setFile(null);
            setMetadata({ name: '', description: '', attributes: [] });
            
        } catch (err) {
            console.error('Minting failed:', err);
        }
    };

    return (
        <div className="nft-minter">
            <h2>Mint Your NFT</h2>
            
            <div className="form-group">
                <label>Upload Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
            
            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    value={metadata.name}
                    onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                />
            </div>
            
            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                />
            </div>
            
            <button 
                onClick={handleMint} 
                disabled={loading || !file || !metadata.name}
            >
                {loading ? 'Minting...' : 'Mint NFT'}
            </button>
            
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default NFTMinter;
```

#### Token Balance Display
```javascript
// components/TokenBalance.jsx
import React, { useState, useEffect } from 'react';
import { useArtPlatform } from '../hooks/useArtPlatform';
import { useWeb3 } from '../hooks/useWeb3';

const TokenBalance = () => {
    const { getTokenBalance, artPlatform } = useArtPlatform();
    const { account } = useWeb3();
    const [balance, setBalance] = useState('0');
    const [tokenInfo, setTokenInfo] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            if (account) {
                const bal = await getTokenBalance(account);
                setBalance(bal);
            }
        };

        const fetchTokenInfo = async () => {
            if (artPlatform) {
                const info = await artPlatform.getTokenInfo();
                setTokenInfo(info);
            }
        };

        fetchBalance();
        fetchTokenInfo();

        // Set up event listener for balance updates
        if (artPlatform) {
            artPlatform.onTokenTransfer((event) => {
                if (event.to === account || event.from === account) {
                    fetchBalance();
                }
            });
        }

        return () => {
            if (artPlatform) {
                artPlatform.removeAllListeners();
            }
        };
    }, [account, artPlatform, getTokenBalance]);

    return (
        <div className="token-balance">
            <h3>Your Creator Tokens</h3>
            <div className="balance-display">
                <span className="amount">{balance}</span>
                <span className="symbol">{tokenInfo?.symbol || 'CTK'}</span>
            </div>
            <div className="token-info">
                <p>Token Name: {tokenInfo?.name || 'CreatorToken'}</p>
                <p>Total Supply: {tokenInfo?.totalSupply || '0'}</p>
            </div>
        </div>
    );
};

export default TokenBalance;
```

## Wallet Integration Considerations

### What Works Automatically
- ✅ NFT display in MetaMask, Trust Wallet, etc.
- ✅ NFT transfers and approvals
- ✅ OpenSea and other marketplace compatibility
- ✅ Standard NFT wallet features

### What Requires Custom Implementation
- ⚠️ Token balance display (won't auto-appear)
- ⚠️ Token transfer interface
- ⚠️ Token approval workflows
- ⚠️ DeFi protocol integration

### Adding Token to MetaMask
```javascript
// utils/addTokenToWallet.js
export const addTokenToMetaMask = async (contractAddress) => {
    try {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: contractAddress,
                    symbol: 'CTK',
                    decimals: 18,
                    image: 'https://your-domain.com/token-logo.png',
                },
            },
        });
    } catch (error) {
        console.error('Failed to add token to MetaMask:', error);
    }
};
```

## Event Monitoring

### Real-time Updates
```javascript
// hooks/useRealtimeUpdates.js
import { useEffect, useState } from 'react';
import { useArtPlatform } from './useArtPlatform';

export const useRealtimeUpdates = () => {
    const { artPlatform } = useArtPlatform();
    const [recentMints, setRecentMints] = useState([]);
    const [recentRewards, setRecentRewards] = useState([]);

    useEffect(() => {
        if (!artPlatform) return;

        // Listen for new NFT mints
        artPlatform.onNFTMinted((event) => {
            setRecentMints(prev => [event, ...prev.slice(0, 9)]); // Keep last 10
        });

        // Listen for token rewards
        artPlatform.onTokenTransfer((event) => {
            if (event.isReward) {
                setRecentRewards(prev => [event, ...prev.slice(0, 9)]); // Keep last 10
            }
        });

        return () => {
            artPlatform.removeAllListeners();
        };
    }, [artPlatform]);

    return { recentMints, recentRewards };
};
```

## Best Practices

### 1. Error Handling
```javascript
const handleContractCall = async (contractFunction) => {
    try {
        const result = await contractFunction();
        return { success: true, data: result };
    } catch (error) {
        console.error('Contract call failed:', error);
        
        // Parse common errors
        if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
            return { success: false, error: 'Transaction would fail. Please check your inputs.' };
        }
        
        if (error.code === 'INSUFFICIENT_FUNDS') {
            return { success: false, error: 'Insufficient funds for transaction.' };
        }
        
        return { success: false, error: error.message };
    }
};
```

### 2. Loading States
```javascript
const [transactionState, setTransactionState] = useState({
    loading: false,
    hash: null,
    confirmed: false,
    error: null
});

const executeTransaction = async (txFunction) => {
    setTransactionState({ loading: true, hash: null, confirmed: false, error: null });
    
    try {
        const tx = await txFunction();
        setTransactionState(prev => ({ ...prev, hash: tx.hash }));
        
        const receipt = await tx.wait();
        setTransactionState(prev => ({ ...prev, loading: false, confirmed: true }));
        
        return receipt;
    } catch (error) {
        setTransactionState(prev => ({ ...prev, loading: false, error: error.message }));
        throw error;
    }
};
```

### 3. Gas Estimation
```javascript
const estimateGas = async (contractFunction, ...args) => {
    try {
        const gasEstimate = await contractFunction.estimateGas(...args);
        const gasPrice = await provider.getGasPrice();
        const gasCost = gasEstimate.mul(gasPrice);
        
        return {
            gasLimit: gasEstimate,
            gasPrice,
            gasCost: ethers.formatEther(gasCost)
        };
    } catch (error) {
        console.error('Gas estimation failed:', error);
        return null;
    }
};
```

This integration guide provides a comprehensive foundation for building a React frontend that works seamlessly with the ArtPlatform contract's unique single-contract architecture.
