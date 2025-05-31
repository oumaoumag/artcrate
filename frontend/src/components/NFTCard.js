import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Image, Send } from 'lucide-react';
import TransferNFTModal from './TransferNFTModal';

const NFTCard = ({ nft }) => {
    const { account } = useWeb3();
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentGatewayIndex, setCurrentGatewayIndex] = useState(0);
    
    // Check if the current user is the owner
    const isOwner = account && account.toLowerCase() === nft.owner?.toLowerCase();    

    const IPFS_GATEWAYS = [ 
        'https://nftstorage.link/ipfs/',
        'https://w3s.link/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://ipfs.filebase.io/ipfs/',
        'https://gateway.ipfs.io/ipfs/',
        'https://dweb.link/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://gateway.pinata.cloud/ipfs/'
    ];

    // Helper function to get proper image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://via.placeholder.com/300?text=NFT';
        
        // If it's a data URL, return as is
        if (imageUrl.startsWith('data:')) {
            return imageUrl;
        }
        
        // If it's already a full URL
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        // If it's an IPFS URL with ipfs:// protocol
        if (imageUrl.startsWith('ipfs://')) {
            const hash = imageUrl.replace('ipfs://', '');
            return IPFS_GATEWAYS[currentGatewayIndex] + hash;
        }
        
        // If it's just an IPFS hash
        if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
            return IPFS_GATEWAYS[currentGatewayIndex] + imageUrl;
        }
        
        // Default fallback
        return 'https://via.placeholder.com/300?text=NFT';
    };

    const handleImageError = () => {
        console.log(`Image failed to load from gateway ${currentGatewayIndex}:`, getImageUrl(nft.image));
        
        // Try next gateway
        if (currentGatewayIndex < IPFS_GATEWAYS.length - 1) {
            setCurrentGatewayIndex(currentGatewayIndex + 1);
        } else {
            // All gateways failed
            setImageError(true);
        }
    };
    
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
                {!imageError && nft.image ? (
                    <img 
                        src={getImageUrl(nft.image)} 
                        alt={nft.title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        onError={handleImageError}
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