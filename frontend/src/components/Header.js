import React from 'react';
import { Wallet, Network, User, Star } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { LAYOUT, ICONS, INTERACTIVE, cn } from '../styles/design-system';

/**
 * Header Component - Refactored with Tailwind
 * Responsive header with wallet connection
 */
const Header = () => {
    const { account, balance, isConnecting, connectWallet, isCorrectNetwork, switchToLiskSepolia } = useWeb3();

    return (
        <header className="header-gradient border-b-4 border-yellow-400 p-4 lg:p-8 shadow-2xl">
            <div className={cn(LAYOUT.container, "flex flex-col sm:flex-row justify-between items-center gap-4")}>
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 coin-gradient rounded-full flex items-center justify-center shadow-xl">
                        <Star size={ICONS.sizes.large} color="#581c87" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gradient-primary">
                            ArtCrate
                        </h1>
                        <p className="text-orange-300 text-sm">
                            Afrofuturistic Creator Economy
                        </p>
                    </div>
                </div>

                {/* Wallet Connection */}
                <div>
                    {account ? (
                        <div className="flex flex-wrap items-center gap-4 bg-black/30 backdrop-blur-lg rounded-xl px-4 py-2 border border-yellow-400/30">
                            {/* Network Status */}
                            <div className="flex items-center gap-2">
                                <Network 
                                    size={ICONS.sizes.small} 
                                    color={isCorrectNetwork ? '#4ade80' : '#ef4444'} 
                                />
                                <span className={cn(
                                    "text-sm",
                                    isCorrectNetwork ? "text-green-400" : "text-red-400"
                                )}>
                                    {isCorrectNetwork ? 'Lisk Sepolia' : 'Wrong Network'}
                                </span>
                                {!isCorrectNetwork && (
                                    <button
                                        onClick={switchToLiskSepolia}
                                        className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded border-none cursor-pointer hover:bg-red-600 transition-colors"
                                    >
                                        Switch
                                    </button>
                                )}
                            </div>
                            
                            {/* Divider */}
                            <div className="hidden sm:block w-px h-6 bg-yellow-400/30" />
                            
                            {/* Account Info */}
                            <div className="flex items-center gap-2">
                                <User size={ICONS.sizes.small} color={ICONS.colors.primary} />
                                <span className="text-yellow-300 font-mono text-sm">
                                    {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                            </div>
                            
                            {/* Balance */}
                            <div>
                                <span className="text-orange-300 text-sm">{balance} ETH</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            disabled={isConnecting}
                            className={cn(
                                INTERACTIVE.button.primary,
                                "shadow-xl"
                            )}
                        >
                            <Wallet size={ICONS.sizes.medium} />
                            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;