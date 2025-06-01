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
        <header className="header-gradient border-b-2 border-yellow-400 p-3 lg:p-4 shadow-xl">
            <div className={cn(LAYOUT.container, "flex flex-col sm:flex-row justify-between items-center gap-3")}>
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 coin-gradient rounded-full flex items-center justify-center shadow-lg">
                        <Star size={ICONS.sizes.medium} color="#581c87" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gradient-primary">
                            ArtCrate
                        </h1>
                        <p className="text-orange-300 text-xs hidden sm:block">
                            Afrofuturistic Creator Economy
                        </p>
                    </div>
                </div>

                {/* Wallet Connection */}
                <div>
                    {account ? (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-lg rounded-lg px-3 py-1.5 border border-yellow-400/30">
                            {/* Network Status */}
                            <div className="flex items-center gap-1.5">
                                <Network 
                                    size={14} 
                                    color={isCorrectNetwork ? '#4ade80' : '#ef4444'} 
                                />
                                <span className={cn(
                                    "text-xs",
                                    isCorrectNetwork ? "text-green-400" : "text-red-400"
                                )}>
                                    {isCorrectNetwork ? 'Lisk' : 'Wrong'}
                                </span>
                                {!isCorrectNetwork && (
                                    <button
                                        onClick={switchToLiskSepolia}
                                        className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded border-none cursor-pointer hover:bg-red-600 transition-colors"
                                    >
                                        Switch
                                    </button>
                                )}
                            </div>
                            
                            {/* Divider */}
                            <div className="hidden sm:block w-px h-4 bg-yellow-400/30" />
                            
                            {/* Account Info */}
                            <div className="flex items-center gap-1.5">
                                <User size={14} color={ICONS.colors.primary} />
                                <span className="text-yellow-300 font-mono text-xs">
                                    {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                            </div>
                            
                            {/* Balance */}
                            <div>
                                <span className="text-orange-300 text-xs">{balance} ETH</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            disabled={isConnecting}
                            className={cn(
                                "btn-gradient-primary text-purple-900 font-bold px-4 py-2 rounded-lg border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                "text-sm shadow-lg"
                            )}
                        >
                            <Wallet size={16} />
                                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;