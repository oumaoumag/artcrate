import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Trash2, RefreshCw, AlertTriangle, Check, Settings, Eye, EyeOff } from 'lucide-react';
import { CARD_CLASSES, TYPOGRAPHY, LAYOUT, ICONS, INTERACTIVE, cn } from '../styles/design-system';

/**
 * NFTManager Component - Refactored with Tailwind and Design System
 * Optimized as a standalone tab for managing problematic NFTs
 */
const NFTManager = () => {
    const { 
        mintedNFTs, 
        hideNFTs, 
        showHiddenNFTs, 
        getHiddenNFTs, 
        clearBadNFTCache, 
        loadUserNFTs, 
        contract, 
        account, 
        fixTruncatedHashes 
    } = useWeb3();
    
    const [badNFTs, setBadNFTs] = useState([]);
    const [selectedNFTs, setSelectedNFTs] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);
    const [showDetails, setShowDetails] = useState(false);

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

    // All Good State
    if (badNFTs.length === 0 && hiddenCount === 0) {
        return (
            <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default)}>
                <div className="text-center py-12">
                    <Check size={ICONS.sizes.hero} className="mx-auto mb-4 text-green-400" />
                    <h3 className="text-2xl font-bold text-green-400 mb-2">All NFTs Look Good!</h3>
                    <p className={TYPOGRAPHY.body.secondary}>
                        No NFTs with missing images or metadata found.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default)}>
            {/* Header */}
            <div className={cn(LAYOUT.flex.between, "mb-6")}>
                <div className={LAYOUT.flex.start}>
                    <Settings size={ICONS.sizes.large} color={ICONS.colors.primary} />
                    <h3 className={TYPOGRAPHY.heading.primary}>NFT Manager</h3>
                </div>
                
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={INTERACTIVE.button.ghost}
                >
                    {showDetails ? <EyeOff size={ICONS.sizes.small} /> : <Eye size={ICONS.sizes.small} />}
                    <span className="text-sm">{showDetails ? 'Hide' : 'Show'} Details</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Hidden NFTs Card */}
                {hiddenCount > 0 && (
                    <div className="bg-orange-400/10 border border-orange-400/30 rounded-xl p-4">
                        <div className={LAYOUT.flex.between}>
                            <div>
                                <p className="text-orange-300 text-sm mb-1">Hidden NFTs</p>
                                <p className="text-2xl font-bold text-orange-400">{hiddenCount}</p>
                            </div>
                            <button
                                onClick={showAllHidden}
                                disabled={isProcessing}
                                className={cn(
                                    "px-3 py-1.5 text-sm rounded-lg transition-all",
                                    "bg-orange-400/20 border border-orange-400/50 text-orange-300",
                                    "hover:bg-orange-400/30",
                                    isProcessing && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                Show All
                            </button>
                        </div>
                    </div>
                )}

                {/* Problematic NFTs Card */}
                {badNFTs.length > 0 && (
                    <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4">
                        <div className={LAYOUT.flex.between}>
                            <div>
                                <p className="text-red-300 text-sm mb-1">Problematic NFTs</p>
                                <p className="text-2xl font-bold text-red-400">{badNFTs.length}</p>
                            </div>
                            <AlertTriangle size={ICONS.sizes.large} className="text-red-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Problematic NFTs Section */}
            {badNFTs.length > 0 && (
                <div className="space-y-4">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={selectAll}
                            className={cn(INTERACTIVE.button.secondary, "text-sm")}
                        >
                            Select All
                        </button>
                        <button
                            onClick={deselectAll}
                            className={cn(INTERACTIVE.button.secondary, "text-sm")}
                        >
                            Deselect All
                        </button>
                        <div className="flex-1" />
                        <button
                            onClick={hideSelected}
                            disabled={selectedNFTs.size === 0 || isProcessing}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
                                "bg-red-400/20 border border-red-400/50 text-red-300",
                                "hover:bg-red-400/30",
                                (selectedNFTs.size === 0 || isProcessing) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Trash2 size={16} />
                            Hide Selected ({selectedNFTs.size})
                        </button>
                        <button
                            onClick={fixBadMetadata}
                            disabled={isProcessing}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
                                "bg-yellow-400/20 border border-yellow-400/50 text-yellow-300",
                                "hover:bg-yellow-400/30",
                                isProcessing && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <RefreshCw size={16} className={isProcessing ? "animate-spin" : ""} />
                            Fix Metadata
                        </button>
                    </div>

                    {/* NFT List */}
                    <div className={cn(
                        "bg-black/20 rounded-xl p-4 space-y-2",
                        showDetails ? "max-h-96" : "max-h-64",
                        "overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400/30 scrollbar-track-transparent"
                    )}>
                        {badNFTs.map(nft => (
                            <label
                                key={nft.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                                    "hover:bg-yellow-400/10",
                                    selectedNFTs.has(nft.id) && "bg-yellow-400/20 border border-yellow-400/30"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedNFTs.has(nft.id)}
                                    onChange={() => toggleSelect(nft.id)}
                                    className="w-4 h-4 rounded border-yellow-400/50 bg-black/30 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-medium">
                                            {nft.title || `NFT #${nft.id}`}
                                        </span>
                                        <span className="text-xs text-orange-300">
                                            ID: {nft.id}
                                        </span>
                                    </div>
                                    {showDetails && (
                                        <div className="mt-1 text-xs text-orange-300/70">
                                            {!nft.image ? 'Missing image' : 'Invalid metadata'}
                                            {nft.ipfsHash && ` • Hash: ${nft.ipfsHash.substring(0, 8)}...`}
                                        </div>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Info Box */}
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 text-sm">
                        <p className="text-yellow-300 mb-2">
                            <strong>Tips for managing problematic NFTs:</strong>
                        </p>
                        <ul className="space-y-1 text-yellow-300/80 list-disc list-inside">
                            <li>Hide NFTs with missing images to clean up your gallery</li>
                            <li>Use "Fix Metadata" to attempt recovering IPFS data</li>
                            <li>Recently minted NFTs may need time for IPFS propagation</li>
                            <li>Hidden NFTs can be restored anytime using "Show All"</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NFTManager;