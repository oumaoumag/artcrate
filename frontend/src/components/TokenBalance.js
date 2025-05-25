import React from 'react';
import { Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

// Shared card styles
const cardStyles = {
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    marginBottom: '1.5rem'
};

const TokenBalance = () => {
    const { tokenBalance } = useWeb3();

    return (
        <div style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>Creator Tokens</h3>
                <Coins size={24} color="#facc15" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #facc15, #f97316)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <Coins size={32} color="#581c87" />
                </div>
                <div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{tokenBalance}</p>
                    <p style={{ color: '#fdba74', margin: 0 }}>CTK Balance</p>
                </div>
            </div>
            <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(250, 204, 21, 0.2)'
            }}>
                <p style={{ fontSize: '0.875rem', color: '#fdba74', margin: 0 }}>
                    Earn 10 CTK for each NFT you mint • Build your creator economy
                </p>
            </div>
        </div>
    );
};

export default TokenBalance;