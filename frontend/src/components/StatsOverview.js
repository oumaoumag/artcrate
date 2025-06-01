import React from 'react';
import { Image, Coins, Star } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { CARD_CLASSES, TYPOGRAPHY, ICONS, cn } from '../styles/design-system';

/**
 * StatsOverview Component - Refactored with Tailwind
 * Displays key statistics in a responsive grid
 */
const StatsOverview = () => {
  const { mintedNFTs, tokenBalance } = useWeb3();
  const totalRewards = mintedNFTs.reduce((sum, nft) => sum + (nft.reward || 10), 0);

  const stats = [
    {
      label: 'NFTs',
      value: mintedNFTs.length,
      icon: Image,
      color: ICONS.colors.primary
    },
    {
      label: 'Earned',
      value: `${totalRewards} CTK`,
      icon: Coins,
      color: ICONS.colors.primary
    },
    {
      label: 'Balance',
      value: `${tokenBalance} CTK`,
      icon: Star,
      color: ICONS.colors.primary
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className={cn(CARD_CLASSES.compact, "p-2 sm:p-3")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-xs mb-0">
                  {stat.label}
                </p>
                <p className="text-base sm:text-lg font-bold text-white">
                  {stat.value}
                </p>
              </div>
              <IconComponent size={16} className="sm:w-5 sm:h-5 hidden sm:block" color={stat.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;