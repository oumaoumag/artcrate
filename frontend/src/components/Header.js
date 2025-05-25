import React from 'react';
import { Wallet, Network, User, Star } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

// Inline styles for the header
const styles = {
    header: {
        background: 'linear-gradient(90deg, #581c87 0%, #ea580c 50%, #eab308 100%)',
        borderBottom: '4px solid #facc15',
        padding: '1rem 2rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    logoIcon: {
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #facc15, #f97316)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #fde047, #fdba74)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
    },
    subtitle: {
        color: '#fdba74',
        fontSize: '0.875rem',
        margin: 0
    },
    walletInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '0.5rem 1rem',
        border: '1px solid rgba(250, 204, 21, 0.3)'
    },
    connectButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'linear-gradient(90deg, #eab308, #f97316)',
        color: '#581c87',
        fontWeight: 'bold',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }
};

const Header = () => {
    const { account, balance, isConnecting, connectWallet, isCorrectNetwork, switchToLiskSepolia } = useWeb3();

    return (
        <header style={styles.header}>
            <div style={styles.headerContent}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>
                        <Star size={24} color="#581c87" />
                    </div>
                    <div>
                        <h1 style={styles.title}>ArtCrate</h1>
                        <p style={styles.subtitle}>Afrofuturistic Creator Economy</p>
                    </div>
                </div>

                <div>
                    {account ? (
                        <div style={styles.walletInfo}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Network size={16} color={isCorrectNetwork ? '#4ade80' : '#ef4444'} />
                                <span style={{ fontSize: '0.875rem', color: isCorrectNetwork ? '#4ade80' : '#ef4444' }}>
                                    {isCorrectNetwork ? 'Lisk Sepolia' : 'Wrong Network'}
                                </span>
                                {!isCorrectNetwork && (
                                    <button
                                        onClick={switchToLiskSepolia}
                                        style={{
                                            marginLeft: '0.5rem',
                                            padding: '0.25rem 0.5rem',
                                            background: '#ef4444',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Switch
                                    </button>
                                )}
                            </div>
                            <div style={{ width: '1px', height: '24px', background: 'rgba(250, 204, 21, 0.3)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={16} color="#facc15" />
                                <span style={{ color: '#fde047', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                    {account.slice(0, 6)}...{account.slice(-4)}
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#fdba74', fontSize: '0.875rem' }}>{balance} ETH</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            disabled={isConnecting}
                            style={{
                                ...styles.connectButton,
                                opacity: isConnecting ? 0.5 : 1,
                                cursor: isConnecting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Wallet size={20} />
                            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;