import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const NFTDebugger = () => {
    const { account, contract, loadUserNFTs, mintedNFTs, isLoadingNFTs, clearBadNFTCache } = useWeb3();
    const [debugInfo, setDebugInfo] = useState('');
    const [isDebugging, setIsDebugging] = useState(false);

    const runDebugCheck = async () => {
        if (!contract || !account) {
            setDebugInfo('Please connect your wallet first');
            return;
        }

        setIsDebugging(true);
        let info = [];

        try {
            // Check NFT balance
            const nftBalance = await contract.nftBalanceOf(account);
            info.push(`✅ NFT Balance: ${nftBalance.toString()}`);

            // Check localStorage
            const localStorageKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('nft_') || key.startsWith('metadata_'))) {
                    localStorageKeys.push(key);
                }
            }
            info.push(`📦 LocalStorage entries: ${localStorageKeys.length}`);

            // Check current loaded NFTs
            info.push(`🖼️ Currently loaded NFTs: ${mintedNFTs.length}`);

            // Try to load first NFT details
            if (nftBalance.gt(0)) {
                try {
                    const tokenId = await contract.tokenOfOwnerByIndex(account, 0);
                    const tokenURI = await contract.tokenURI(tokenId);
                    info.push(`\n🔍 First NFT Details:`);
                    info.push(`  - Token ID: ${tokenId.toString()}`);
                    info.push(`  - Token URI: ${tokenURI.substring(0, 100)}...`);
                } catch (e) {
                    info.push(`❌ Error loading first NFT: ${e.message}`);
                }
            }

            setDebugInfo(info.join('\n'));
        } catch (error) {
            setDebugInfo(`Error: ${error.message}`);
        } finally {
            setIsDebugging(false);
        }
    };

    const clearCache = () => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('nft_') || key.startsWith('metadata_') || key === 'userNFTs')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        setDebugInfo(`Cleared ${keysToRemove.length} cache entries`);
    };

    const clearBadCache = async () => {
        const removed = clearBadNFTCache();
        setDebugInfo(`Removed ${removed} NFTs with placeholder metadata. Reloading...`);
        
        if (contract && account) {
            setTimeout(async () => {
                await loadUserNFTs(contract, account);
                setDebugInfo(`Removed ${removed} bad entries and reloaded NFTs.`);
            }, 500);
        }
    };

    const forceReload = async () => {
        if (!contract || !account) {
            setDebugInfo('Please connect your wallet first');
            return;
        }
        
        setDebugInfo('Force reloading NFTs...');
        await loadUserNFTs(contract, account);
        setDebugInfo('NFTs reloaded! Check the gallery.');
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={24} color="#facc15" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>NFT Debug Tools</h3>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={runDebugCheck}
                    disabled={isDebugging || !account}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(250, 204, 21, 0.2)',
                        border: '1px solid rgba(250, 204, 21, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        color: '#fde047',
                        cursor: !account || isDebugging ? 'not-allowed' : 'pointer',
                        opacity: !account || isDebugging ? 0.5 : 1,
                    }}
                >
                    <CheckCircle size={16} />
                    Run Debug Check
                </button>

                <button
                    onClick={forceReload}
                    disabled={isLoadingNFTs || !account}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(250, 204, 21, 0.2)',
                        border: '1px solid rgba(250, 204, 21, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        color: '#fde047',
                        cursor: !account || isLoadingNFTs ? 'not-allowed' : 'pointer',
                        opacity: !account || isLoadingNFTs ? 0.5 : 1,
                    }}
                >
                    <RefreshCw size={16} />
                    Force Reload NFTs
                </button>

                <button
                    onClick={clearBadCache}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(250, 204, 21, 0.2)',
                        border: '1px solid rgba(250, 204, 21, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        color: '#fde047',
                        cursor: 'pointer',
                    }}
                >
                    Fix Bad Metadata
                </button>

                <button
                    onClick={clearCache}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(234, 88, 12, 0.2)',
                        border: '1px solid rgba(234, 88, 12, 0.5)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        color: '#fb923c',
                        cursor: 'pointer',
                    }}
                >
                    Clear All Cache
                </button>
            </div>

            {debugInfo && (
                <pre style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(250, 204, 21, 0.2)',
                    borderRadius: '8px',
                    padding: '1rem',
                    color: '#fdba74',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '1rem',
                }}>
                    {debugInfo}
                </pre>
            )}
        </div>
    );
};

export default NFTDebugger;