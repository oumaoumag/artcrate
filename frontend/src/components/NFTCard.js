import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Image, Send } from 'lucide-react';
import TransferNFTModal from './TransferNFTModal';
import { ICONS, cn } from '../styles/design-system';

/**
 * NFTCard Component - Refactored with Tailwind
 * Displays individual NFT with image fallback handling
 */
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
        
        if (imageUrl.startsWith('data:')) return imageUrl;
        if (imageUrl.startsWith('http')) return imageUrl;
        
        if (imageUrl.startsWith('ipfs://')) {
            const hash = imageUrl.replace('ipfs://', '');
            return IPFS_GATEWAYS[currentGatewayIndex] + hash;
        }
        
        if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
            return IPFS_GATEWAYS[currentGatewayIndex] + imageUrl;
        }
        
        return 'https://via.placeholder.com/300?text=NFT';
    };

    const handleImageError = () => {
        console.log(`Image failed to load from gateway ${currentGatewayIndex}:`, getImageUrl(nft.image));
        
        // Try next gateway
        if (currentGatewayIndex < IPFS_GATEWAYS.length - 1) {
            setCurrentGatewayIndex(currentGatewayIndex + 1);
        } else {
            setImageError(true);
        }
    };
    
    return (
        <div className="bg-gradient-to-br from-purple-800/30 to-orange-800/30 backdrop-blur-lg border border-yellow-400/30 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl h-full flex flex-col">
            {/* Image Container */}
            <div className="relative pt-[100%] bg-black/20">
                {!imageError && nft.image ? (
                    <img 
                        src={getImageUrl(nft.image)} 
                        alt={nft.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image size={ICONS.sizes.hero} color="rgba(253, 186, 116, 0.5)" />
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-yellow-300 mb-2 truncate">
                    {nft.title}
                </h3>
                
                <p className="text-sm text-orange-300 mb-2 flex-1 line-clamp-3">
                    {nft.description || 'No description available'}
                </p>
                
                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-yellow-400/20">
                    <div className="text-xs text-orange-300">
                        ID: {nft.id}
                    </div>
                    
                    {isOwner && (
                        <button 
                            onClick={() => setShowTransferModal(true)}
                            className="flex items-center gap-1 bg-yellow-400/20 hover:bg-yellow-400/30 border-none rounded px-2 py-1 text-yellow-300 cursor-pointer text-xs transition-colors duration-200"
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