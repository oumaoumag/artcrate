import React from 'react';
import { Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { CARD_CLASSES, TYPOGRAPHY, LAYOUT, ICONS, cn } from '../styles/design-system';

/**
 * Unified TokenBalance Component
 * Supports both compact and full display modes
 * Uses design system for consistent styling
 */
const TokenBalance = ({ variant = 'full', className = '' }) => {
  const { tokenBalance } = useWeb3();
  
  const isCompact = variant === 'compact';
  
  // Dynamic classes based on variant
  const cardClasses = cn(
    isCompact ? CARD_CLASSES.compact : CARD_CLASSES.base,
    isCompact ? CARD_CLASSES.padding.compact : CARD_CLASSES.padding.default,
    isCompact ? CARD_CLASSES.spacing.compact : CARD_CLASSES.spacing.default,
    className
  );
  
  const iconSize = isCompact ? ICONS.sizes.medium : ICONS.sizes.large;
  const coinIconSize = isCompact ? ICONS.sizes.small : ICONS.sizes.xlarge;
  const coinContainerSize = isCompact ? 'w-10 h-10' : 'w-16 h-16';
  
  if (isCompact) {
    return (

      <div className={cn(cardClasses, "p-2 sm:p-3 mb-2")}>
        <div className={LAYOUT.flex.between}>
          <div className={LAYOUT.flex.start}>
            <div className={cn(
              "w-7 h-7 sm:w-8 sm:h-8",
                "coin-gradient rounded-full flex items-center justify-center shadow-lg"
            )}>
              <Coins size={14} className="sm:w-4 sm:h-4" color="#581c87" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white m-0 leading-none">
                {tokenBalance}
              </p>
              <p className="text-xs text-orange-300 m-0 leading-none">
                Creator Tokens
              </p>
            </div>
          </div>
          
          <div className="text-xs text-orange-300/80 text-right hidden sm:block">
            +10 CTK per mint
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cardClasses}>
      <div className={cn(LAYOUT.flex.between, "mb-6")}>
        <h3 className={TYPOGRAPHY.heading.primary}>Creator Tokens</h3>
        <Coins size={iconSize} color={ICONS.colors.primary} />
      </div>
      
      <div className={cn(LAYOUT.flex.start, "mb-4")}>
        <div className={cn(
          coinContainerSize,
          "coin-gradient rounded-full flex items-center justify-center shadow-xl"
        )}>
          <Coins size={coinIconSize} color="#581c87" />
        </div>
        <div>
          <p className={TYPOGRAPHY.display.large}>
            {tokenBalance}
          </p>
          <p className={TYPOGRAPHY.body.secondary}>
            CTK Balance
          </p>
        </div>
      </div>
      
      <div className="bg-black/20 border border-yellow-400/20 rounded-xl p-3">
        <p className={TYPOGRAPHY.body.small}>
          Earn 10 CTK for each NFT you mint • Build your creator economy
        </p>
      </div>
    </div>
  );
};

export default TokenBalance;