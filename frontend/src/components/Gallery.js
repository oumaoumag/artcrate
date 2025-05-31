import React, { useState, useEffect } from 'react';
import { Image, Coins, Filter, Eye, EyeOff } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import  NFTCard from '../components/NFTCard.js'
import NFTManager from './NFTManager';

// Helper function to handle different image URL formats
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    // If it's a data URL, return as is
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // If it's already a full URL (including IPFS gateway)
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If it's an IPFS URL with ipfs:// protocol
    if (imageUrl.startsWith('ipfs://')) {
        return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    // If it's just an IPFS hash
    if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
        return `https://ipfs.io/ipfs/${imageUrl}`;
    }
    
    // Default case - assume it's an IPFS hash or path
    return `https://ipfs.io/ipfs/${imageUrl}`;
};

// Shared card styles
const cardStyles = {
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    marginBottom: '1.5rem'
};


const Gallery = () => {
    const { mintedNFTs, isLoadingNFTs } = useWeb3();
    const [showOnlyGood, setShowOnlyGood] = useState(false);
    const [validNFTs, setValidNFTs] = useState(new Set());
    const [checkingNFTs, setCheckingNFTs] = useState(false);

    // Check which NFTs have valid images
    useEffect(() => {
        const checkNFTImages = async () => {
            if (mintedNFTs.length === 0) return;
            
            // Add a delay to allow newly minted NFTs to load properly
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setCheckingNFTs(true);
            const valid = new Set();
            
            for (const nft of mintedNFTs) {
                // Check if NFT was recently minted (within last 5 minutes)
                const isRecentlyMinted = nft.timestamp && 
                    (new Date() - new Date(nft.timestamp)) < 5 * 60 * 1000;
                
                // Check if NFT has good metadata
                // Be more lenient with newly minted NFTs that might have temporary generic titles
                const hasGoodMetadata = 
                    nft.description && 
                    nft.description !== 'IPFS metadata (not cached)' &&
                    nft.description !== 'Unable to fetch IPFS metadata' &&
                    nft.description !== 'IPFS metadata unavailable' &&
                    nft.description !== 'Metadata unavailable' &&
                    nft.description !== 'Loading...' &&
                    nft.description !== '';
                
                // Check if NFT has an image
                const hasImage = nft.image && nft.image !== '';
                
                // Always consider recently minted NFTs as valid
                if (isRecentlyMinted && hasImage) {
                    valid.add(nft.id);
                    continue;
                }
                
                if (hasGoodMetadata && hasImage) {
                    // Try to verify the image loads
                    try {
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = () => resolve(true);
                            img.onerror = () => reject(false);
                            img.src = getImageUrl(nft.image);
                            
                            // Timeout after 3 seconds
                            setTimeout(() => reject(false), 3000);
                        });
                        valid.add(nft.id);
                    } catch (e) {
                        console.log(`NFT ${nft.id} image failed to load`);
                    }
                } else {
                    console.log(`NFT ${nft.id} has bad metadata or no image`);
                }
            }
            
            setValidNFTs(valid);
            setCheckingNFTs(false);
            
            // Save preference
            localStorage.setItem('showOnlyGoodNFTs', showOnlyGood ? 'true' : 'false');
        };
        
        checkNFTImages();
    }, [mintedNFTs]);

    // Load preference
    useEffect(() => {
        const saved = localStorage.getItem('showOnlyGoodNFTs');
        if (saved === 'true') {
            setShowOnlyGood(true);
        }
    }, []);

    // Filter NFTs based on toggle
    const displayNFTs = showOnlyGood 
        ? mintedNFTs.filter(nft => validNFTs.has(nft.id))
        : mintedNFTs;

    const toggleFilter = () => {
        const newValue = !showOnlyGood;
        setShowOnlyGood(newValue);
        localStorage.setItem('showOnlyGoodNFTs', newValue ? 'true' : 'false');
    };

    return (
        <>
            {/* NFT Manager for handling bad NFTs */}
            {mintedNFTs.length > 0 && <NFTManager />}
            
            <div style={cardStyles}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '1.5rem' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Image size={24} color="#facc15" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>
                        NFT Gallery
                    </h3>
                </div>
                
                {mintedNFTs.length > 0 && (
                    <button
                        onClick={toggleFilter}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: showOnlyGood ? 'rgba(34, 197, 94, 0.2)' : 'rgba(250, 204, 21, 0.2)',
                            border: `1px solid ${showOnlyGood ? 'rgba(34, 197, 94, 0.5)' : 'rgba(250, 204, 21, 0.5)'}`,
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: showOnlyGood ? '#86efac' : '#fde047',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {showOnlyGood ? <Eye size={16} /> : <EyeOff size={16} />}
                        {showOnlyGood ? 'Showing Good NFTs' : 'Showing All NFTs'}
                        {checkingNFTs && ' (checking...)'}
                    </button>
                )}
            </div>

            {showOnlyGood && mintedNFTs.length > 0 && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    color: '#86efac',
                }}>
                    <Filter size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Showing {displayNFTs.length} of {mintedNFTs.length} NFTs with valid images and metadata
                </div>
            )}

            {isLoadingNFTs ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid rgba(253, 186, 116, 0.3)',
                        borderTopColor: '#fdba74',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <p style={{ color: '#fdba74' }}>Loading your NFTs...</p>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : displayNFTs.length === 0 && showOnlyGood ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <EyeOff size={64} color="rgba(253, 186, 116, 0.5)" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fdba74', marginBottom: '0.5rem' }}>
                        No Valid NFTs Found
                    </h4>
                    <p style={{ color: 'rgba(253, 186, 116, 0.7)', marginBottom: '1rem' }}>
                        All your NFTs have missing images or metadata
                    </p>
                    <button
                        onClick={toggleFilter}
                        style={{
                            background: 'rgba(250, 204, 21, 0.2)',
                            border: '1px solid rgba(250, 204, 21, 0.5)',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            color: '#fde047',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                        }}
                    >
                        Show All NFTs
                    </button>
                </div>
            ) : mintedNFTs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Image size={64} color="rgba(253, 186, 116, 0.5)" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fdba74', marginBottom: '0.5rem' }}>Gallery Coming Soon</h4>
                    <p style={{ color: 'rgba(253, 186, 116, 0.7)' }}>Mint your first NFT to start building your collection</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {displayNFTs.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                    ))}
                </div>
            )}
            </div>
        </>
    );
};

export default Gallery;