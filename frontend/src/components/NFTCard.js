import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Image, Send } from 'lucide-react';
import TransferNFTModal from './TransferNFTModal';

const NFTCard = ({ nft }) => {
    const { account } = useWeb3();
    const [showTransferModal, setShowTransferModal] = useState(false);
    
    // Check if the current user is the owner
    const isOwner = account && account.toLowerCase() === nft.owner?.toLowerCase();    

    const IPFS_GATEWAYS = [ 
        'https://ipfs.io/ipfs/',
        'https://gateway.pinata.cloud/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://dweb.link/ipfs/',
        'https:w3s.link/ipfs'
    ];
    
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(234, 88, 12, 0.3))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                position: 'relative',
                paddingTop: '100%', // 1:1 Aspect ratio
                backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
                {nft.image ? (
                    <img 
                        src={nft.image} 
                        alt={nft.title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        onError={(e) => {
                            console.log('Image failed to load:', nft.image);
                            console.log.apply('Error:', e);
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300?text=NFT';
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image size={64} color="rgba(253, 186, 116, 0.5)" />
                    </div>
                )}
            </div>
            
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: '#fde047',
                    marginTop: 0,
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {nft.title}
                </h3>
                
                <p style={{ 
                    fontSize: '0.875rem',
                    color: '#fdba74',
                    marginBottom: '0.5rem',
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                }}>
                    {nft.description || 'No description available'}
                </p>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    borderTop: '1px solid rgba(250, 204, 21, 0.2)',
                    paddingTop: '0.75rem',
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#fdba74' }}>
                        ID: {nft.id}
                    </div>
                    
                    {isOwner && (
                        <button 
                            onClick={() => setShowTransferModal(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                background: 'rgba(250, 204, 21, 0.2)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                color: '#fde047',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                            }}
                        >
                            <Send size={14} />
                            <span>Transfer</span>
                        </button>
                    )}
                </div>
            </div>
            
            {showTransferModal && (
                <TransferNFTModal 
                    nft={nft} 
                    onClose={() => setShowTransferModal(false)} 
                />
            )}
        </div>
    );
};

export default NFTCard;