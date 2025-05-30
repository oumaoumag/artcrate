import React, { useState } from 'react';
import { Image, Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

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

// NFT Card component with error handling
const NFTCard = ({ nft }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
        console.warn('Failed to load image for NFT:', nft.id, nft.image);
    };

    return (
        <div
            style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                border: '1px solid rgba(250, 204, 21, 0.2)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ aspectRatio: '1', position: 'relative', overflow: 'hidden' }}>
                {nft.image && !imageError ? (
                    <>
                        {imageLoading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #7c3aed, #ea580c)',
                                zIndex: 1
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    borderTop: '3px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        )}
                        <img
                            src={getImageUrl(nft.image)}
                            alt={nft.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                opacity: imageLoading ? 0 : 1
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            onMouseEnter={(e) => {
                                if (!imageLoading) e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />
                    </>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #7c3aed, #ea580c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <Image size={64} color="rgba(255,255,255,0.5)" />
                        {imageError && (
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                                Failed to load
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div style={{ padding: '1rem' }}>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    {nft.title}
                </h4>
                {nft.description && (
                    <p style={{
                        color: '#fdba74',
                        fontSize: '0.875rem',
                        marginBottom: '0.75rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {nft.description}
                    </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                        color: '#fdba74',
                        fontSize: '0.875rem',
                        fontFamily: 'monospace'
                    }}>
                        {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15' }}>
                        <Coins size={12} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>+{nft.reward}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Gallery = () => {
    const { mintedNFTs } = useWeb3();

    return (
        <div style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Image size={24} color="#facc15" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>NFT Gallery</h3>
            </div>

            {mintedNFTs.length === 0 ? (
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
                    {mintedNFTs.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;