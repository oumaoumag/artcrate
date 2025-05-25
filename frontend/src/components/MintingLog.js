import React from 'react';
import { Zap, Image, Coins } from 'lucide-react';
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

const MintingLog = () => {
    const { mintedNFTs } = useWeb3();

    return (
        <div style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Zap size={24} color="#facc15" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>Minting Activity</h3>
            </div>

            {mintedNFTs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <Image size={48} color="rgba(253, 186, 116, 0.5)" style={{ margin: '0 auto 0.75rem' }} />
                    <p style={{ color: '#fdba74', marginBottom: '0.5rem' }}>No NFTs minted yet</p>
                    <p style={{ color: 'rgba(253, 186, 116, 0.7)', fontSize: '0.875rem' }}>Start creating to see your minting history</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {mintedNFTs.map((nft) => (
                        <div
                            key={nft.id}
                            style={{
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '12px',
                                padding: '1rem',
                                border: '1px solid rgba(250, 204, 21, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.4)';
                                e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.2)';
                                e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {nft.image ? (
                                    <img
                                        src={nft.image}
                                        alt={nft.title}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            flexShrink: 0
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'linear-gradient(135deg, #7c3aed, #ea580c)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Image size={24} color="rgba(255,255,255,0.7)" />
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        margin: 0,
                                        marginBottom: '0.25rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {nft.title}
                                    </h4>
                                    <p style={{
                                        color: '#fdba74',
                                        fontSize: '0.875rem',
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {new Date(nft.timestamp).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        color: '#facc15',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <Coins size={16} />
                                        <span style={{ fontWeight: 'bold' }}>+{nft.reward} CTK</span>
                                    </div>
                                    <p style={{
                                        color: '#4ade80',
                                        fontSize: '0.875rem',
                                        margin: 0,
                                        fontWeight: 'medium'
                                    }}>
                                        Minted
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MintingLog;