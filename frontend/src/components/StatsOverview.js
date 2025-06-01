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
      label: 'Total NFTs',
      value: mintedNFTs.length,
      icon: Image,
      color: ICONS.colors.primary
    },
    {
      label: 'Tokens Earned',
      value: `${totalRewards} CTK`,
      icon: Coins,
      color: ICONS.colors.primary
    },
    {
      label: 'Total Balance',
      value: `${tokenBalance} CTK`,
      icon: Star,
      color: ICONS.colors.primary
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
              <IconComponent size={ICONS.sizes.xlarge} color={stat.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;