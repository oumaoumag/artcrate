import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Trash2, RefreshCw, AlertTriangle, Check } from 'lucide-react';

const NFTManager = () => {
    const { mintedNFTs, hideNFTs, showHiddenNFTs, getHiddenNFTs, clearBadNFTCache, loadUserNFTs, contract, account, fixTruncatedHashes } = useWeb3();
    const [badNFTs, setBadNFTs] = useState([]);
    const [selectedNFTs, setSelectedNFTs] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);

    useEffect(() => {
        // Check for bad NFTs
        const bad = mintedNFTs.filter(nft => 
            !nft.image || 
            nft.image === '' ||
            nft.description === 'IPFS metadata (not cached)' ||
            nft.description === 'Unable to fetch IPFS metadata' ||
            nft.description === 'IPFS metadata unavailable' ||
            nft.description === 'Metadata unavailable' ||
            nft.title === `NFT #${nft.id}`
        );
        setBadNFTs(bad);

        // Update hidden count
        setHiddenCount(getHiddenNFTs().length);
    }, [mintedNFTs, getHiddenNFTs]);

    const toggleSelect = (nftId) => {
        const newSelected = new Set(selectedNFTs);
        if (newSelected.has(nftId)) {
            newSelected.delete(nftId);
        } else {
            newSelected.add(nftId);
        }
        setSelectedNFTs(newSelected);
    };

    const selectAll = () => {
        setSelectedNFTs(new Set(badNFTs.map(nft => nft.id)));
    };

    const deselectAll = () => {
        setSelectedNFTs(new Set());
    };

    const hideSelected = async () => {
        if (selectedNFTs.size === 0) return;
        
        setIsProcessing(true);
        const idsToHide = Array.from(selectedNFTs);
        hideNFTs(idsToHide);
        setSelectedNFTs(new Set());
        setIsProcessing(false);
    };

    const fixBadMetadata = async () => {
        setIsProcessing(true);
        
        // First try to fix truncated hashes
        const fixed = await fixTruncatedHashes();
        console.log(`Fixed ${fixed} truncated hashes`);
        
        // Then clear bad cache
        clearBadNFTCache();
        
        if (contract && account) {
            await loadUserNFTs(contract, account);
        }
        
        setIsProcessing(false);
    };

    const showAllHidden = async () => {
        setIsProcessing(true);
        await showHiddenNFTs();
        setIsProcessing(false);
    };

    if (badNFTs.length === 0 && hiddenCount === 0) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(16, 185, 129, 0.5))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                <Check size={48} color="#86efac" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#86efac', marginBottom: '0.5rem' }}>All NFTs Look Good!</h3>
                <p style={{ color: '#bbf7d0', fontSize: '0.875rem' }}>
                    No NFTs with missing images or metadata found.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.5), rgba(220, 38, 38, 0.5))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <AlertTriangle size={24} color="#fb923c" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fed7aa', margin: 0 }}>
                    NFT Manager
                </h3>
            </div>

            {hiddenCount > 0 && (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(251, 146, 60, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ color: '#fed7aa' }}>
                        {hiddenCount} NFT{hiddenCount !== 1 ? 's' : ''} currently hidden
                    </span>
                    <button
                        onClick={showAllHidden}
                        disabled={isProcessing}
                        style={{
                            background: 'rgba(251, 146, 60, 0.2)',
                            border: '1px solid rgba(251, 146, 60, 0.5)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.75rem',
                            color: '#fed7aa',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        Show All
                    </button>
                </div>
            )}

            {badNFTs.length > 0 && (
                <>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: '#fed7aa', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Found {badNFTs.length} NFT{badNFTs.length !== 1 ? 's' : ''} with issues:
                        </p>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <button
                                onClick={selectAll}
                                style={{
                                    background: 'rgba(251, 146, 60, 0.2)',
                                    border: '1px solid rgba(251, 146, 60, 0.5)',
                                    borderRadius: '6px',
                                    padding: '0.25rem 0.75rem',
                                    color: '#fed7aa',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                }}
                            >
                                Select All
                            </button>
                            <button
                                onClick={deselectAll}
                                style={{
                                    background: 'rgba(251, 146, 60, 0.2)',
                                    border: '1px solid rgba(251, 146, 60, 0.5)',
                                    borderRadius: '6px',
                                    padding: '0.25rem 0.75rem',
                                    color: '#fed7aa',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                }}
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginBottom: '1rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                    }}>
                        {badNFTs.map(nft => (
                            <label
                                key={nft.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    background: selectedNFTs.has(nft.id) ? 'rgba(251, 146, 60, 0.2)' : 'transparent',
                                    marginBottom: '0.25rem',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedNFTs.has(nft.id)}
                                    onChange={() => toggleSelect(nft.id)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span style={{ color: '#fed7aa', fontSize: '0.875rem' }}>
                                    {nft.title} (ID: {nft.id})
                                </span>
                                <span style={{ color: '#fb923c', fontSize: '0.75rem', marginLeft: 'auto' }}>
                                    {!nft.image ? 'No image' : 'Bad metadata'}
                                </span>
                            </label>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={hideSelected}
                            disabled={selectedNFTs.size === 0 || isProcessing}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(220, 38, 38, 0.2)',
                                border: '1px solid rgba(220, 38, 38, 0.5)',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                color: '#fca5a5',
                                cursor: selectedNFTs.size === 0 || isProcessing ? 'not-allowed' : 'pointer',
                                opacity: selectedNFTs.size === 0 || isProcessing ? 0.5 : 1,
                            }}
                        >
                            <Trash2 size={16} />
                            Hide Selected ({selectedNFTs.size})
                        </button>

                        <button
                            onClick={fixBadMetadata}
                            disabled={isProcessing}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(251, 146, 60, 0.2)',
                                border: '1px solid rgba(251, 146, 60, 0.5)',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                color: '#fed7aa',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                opacity: isProcessing ? 0.5 : 1,
                            }}
                        >
                            <RefreshCw size={16} />
                            Try Fix Metadata
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NFTManager;