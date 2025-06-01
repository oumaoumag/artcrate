import React from 'react';
import { Zap, Image, Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { CARD_CLASSES, TYPOGRAPHY, LAYOUT, ICONS, cn } from '../styles/design-system';

/**
 * MintingLog Component - Refactored with Tailwind
 * Displays user's minting activity history
 */
const MintingLog = () => {
    const { mintedNFTs } = useWeb3();

    return (
        <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default, CARD_CLASSES.spacing.default)}>
            <div className={cn(LAYOUT.flex.start, "mb-6")}>
                <Zap size={ICONS.sizes.large} color={ICONS.colors.primary} />
                <h3 className={TYPOGRAPHY.heading.primary}>Minting Activity</h3>
            </div>

            {mintedNFTs.length === 0 ? (
                <div className="text-center py-8">
                    <Image size={ICONS.sizes.xlarge * 1.5} color="rgba(253, 186, 116, 0.5)" className="mx-auto mb-3" />
                    <p className="text-orange-300 mb-2">No NFTs minted yet</p>
                    <p className="text-orange-300/70 text-sm">Start creating to see your minting history</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {mintedNFTs.map((nft) => (
                        <div
                            key={nft.id}
                            className="bg-black/20 rounded-xl p-4 border border-yellow-400/20 transition-all duration-300 hover:border-yellow-400/40 hover:bg-black/30"
                        >
                            <div className="flex items-center gap-4">
                                {/* NFT Image/Placeholder */}
                                {nft.image ? (
                                    <img
                                        src={nft.image}
                                        alt={nft.title}
                                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-800 to-orange-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Image size={ICONS.sizes.large} color="rgba(255,255,255,0.7)" />
                                    </div>
                                )}
                                
                                {/* NFT Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold mb-1 truncate">
                                        {nft.title}
                                    </h4>
                                    <p className="text-orange-300 text-sm truncate">
                                        {new Date(nft.timestamp).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                
                                {/* Reward Info */}
                                <div className="text-right flex-shrink-0">
                                    <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                        <Coins size={ICONS.sizes.small} />
                                        <span className="font-bold">+{nft.reward || 10} CTK</span>
                                    </div>
                                    <p className="text-green-400 text-sm font-medium">
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