import React, { useState, useEffect } from 'react';
import { Image, Filter, Eye, EyeOff } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import NFTCard from './NFTCard';
import { CARD_CLASSES, TYPOGRAPHY, LAYOUT, ICONS, INTERACTIVE, cn } from '../styles/design-system';

/**
 * Gallery Component - Refactored with Tailwind and Design System
 * Optimized for full-width display with responsive grid
 */

// Helper function to handle different image URL formats
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    if (imageUrl.startsWith('data:')) return imageUrl;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('ipfs://')) {
        return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
        return `https://ipfs.io/ipfs/${imageUrl}`;
    }
    
    return `https://ipfs.io/ipfs/${imageUrl}`;
};

const Gallery = () => {
    const { mintedNFTs, isLoadingNFTs } = useWeb3();
    const [showOnlyGood, setShowOnlyGood] = useState(false);
    const [validNFTs, setValidNFTs] = useState(new Set());
    const [checkingNFTs, setCheckingNFTs] = useState(false);

    // NFT validation logic
    useEffect(() => {
        const checkNFTImages = async () => {
            if (mintedNFTs.length === 0) return;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCheckingNFTs(true);
            const valid = new Set();
            
            for (const nft of mintedNFTs) {
                const isRecentlyMinted = nft.timestamp && 
                    (new Date() - new Date(nft.timestamp)) < 5 * 60 * 1000;
                
                const hasGoodMetadata = 
                    nft.description && 
                    !['IPFS metadata (not cached)', 'Unable to fetch IPFS metadata', 
                      'IPFS metadata unavailable', 'Metadata unavailable', 'Loading...', '']
                    .includes(nft.description);
                
                const hasImage = nft.image && nft.image !== '';
                
                if (isRecentlyMinted && hasImage) {
                    valid.add(nft.id);
                    continue;
                }
                
                if (hasGoodMetadata && hasImage) {
                    try {
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = () => resolve(true);
                            img.onerror = () => reject(false);
                            img.src = getImageUrl(nft.image);
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
            localStorage.setItem('showOnlyGoodNFTs', showOnlyGood ? 'true' : 'false');
        };
        
        checkNFTImages();
    }, [mintedNFTs, showOnlyGood]);

    // Load preference
    useEffect(() => {
        const saved = localStorage.getItem('showOnlyGoodNFTs');
        if (saved === 'true') {
            setShowOnlyGood(true);
        }
    }, []);

    const displayNFTs = showOnlyGood 
        ? mintedNFTs.filter(nft => validNFTs.has(nft.id))
        : mintedNFTs;

    const toggleFilter = () => {
        const newValue = !showOnlyGood;
        setShowOnlyGood(newValue);
        localStorage.setItem('showOnlyGoodNFTs', newValue ? 'true' : 'false');
    };

    return (
        <div className={cn("card-gradient backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl", CARD_CLASSES.padding.default, CARD_CLASSES.spacing.default)}>
                {/* Header */}
                <div className={cn(LAYOUT.flex.between, "mb-6")}>
                    <div className={LAYOUT.flex.start}>
                        <Image size={ICONS.sizes.large} color={ICONS.colors.primary} />
                        <h3 className={TYPOGRAPHY.heading.primary}>NFT Gallery</h3>
                    </div>
                    
                    {mintedNFTs.length > 0 && (
                        <button
                            onClick={toggleFilter}
                            className={cn(
                                INTERACTIVE.button.secondary,
                                showOnlyGood ? "bg-green-400/20 border-green-400/50 text-green-300" : ""
                            )}
                        >
                            {showOnlyGood ? <Eye size={ICONS.sizes.small} /> : <EyeOff size={ICONS.sizes.small} />}
                            <span className="hidden sm:inline">
                                {showOnlyGood ? 'Showing Good NFTs' : 'Showing All NFTs'}
                            </span>
                            <span className="sm:hidden">
                                {showOnlyGood ? 'Good' : 'All'}
                            </span>
                            {checkingNFTs && <span className="text-xs">(checking...)</span>}
                        </button>
                    )}
                </div>

                {/* Filter Info */}
                {showOnlyGood && mintedNFTs.length > 0 && (
                    <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3 mb-4 text-sm text-green-300">
                        <div className={LAYOUT.flex.start}>
                            <Filter size={ICONS.sizes.small} />
                            <span>
                                Showing {displayNFTs.length} of {mintedNFTs.length} NFTs with valid images and metadata
                            </span>
                        </div>
                    </div>
                )}

                {/* Content */}
                {isLoadingNFTs ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-3 border-orange-300/30 border-t-orange-300 rounded-full mx-auto mb-4 animate-spin" />
                        <p className={TYPOGRAPHY.body.secondary}>Loading your NFTs...</p>
                    </div>
                ) : displayNFTs.length === 0 && showOnlyGood ? (
                    <div className="text-center py-12">
                        <EyeOff size={ICONS.sizes.hero} color="rgba(253, 186, 116, 0.5)" className="mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-orange-300 mb-2">No Valid NFTs Found</h4>
                        <p className="text-orange-300/70 mb-4">
                            All your NFTs have missing images or metadata
                        </p>
                        <button
                            onClick={toggleFilter}
                            className={INTERACTIVE.button.secondary}
                        >
                            Show All NFTs
                        </button>
                    </div>
                ) : mintedNFTs.length === 0 ? (
                    <div className="text-center py-12">
                        <Image size={ICONS.sizes.hero} color="rgba(253, 186, 116, 0.5)" className="mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-orange-300 mb-2">Gallery Coming Soon</h4>
                        <p className="text-orange-300/70">
                            Mint your first NFT to start building your collection
                        </p>
                    </div>
                ) : (
                    <div className={LAYOUT.grid.gallery}>
                        {displayNFTs.map((nft) => (
                            <NFTCard key={nft.id} nft={nft} />
                        ))}
                    </div>
                )}
            </div>
    );
};

export default Gallery;