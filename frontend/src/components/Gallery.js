import React from 'react';
import { Image, Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

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
                        <div
                            key={nft.id}
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
                                {nft.image ? (
                                    <img
                                        src={nft.image}
                                        alt={nft.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #7c3aed, #ea580c)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Image size={64} color="rgba(255,255,255,0.5)" />
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;