import React from 'react';
import { Wallet, Star, Zap } from 'lucide-react';
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

const DemoContent = () => {
  const { account, tokenBalance, mintedNFTs } = useWeb3();

  if (!account) {
    return (
      <div style={cardStyles}>
        <div style={{ textAlign: 'center' }}>
          <Wallet size={64} color="#facc15" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', marginBottom: '0.5rem' }}>
            Connect Your Wallet
          </h3>
          <p style={{ color: '#fdba74' }}>
            Connect your wallet to start minting NFTs and earning Creator Tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div style={cardStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>Platform Stats</h3>
          <Star size={24} color="#facc15" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              {mintedNFTs.length}
            </p>
            <p style={{ color: '#fdba74', fontSize: '0.875rem', margin: 0 }}>NFTs Minted</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              {tokenBalance}
            </p>
            <p style={{ color: '#fdba74', fontSize: '0.875rem', margin: 0 }}>CTK Earned</p>
          </div>
        </div>
      </div>

      <div style={cardStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>
            Smart Contract Integration
          </h3>
          <Zap size={24} color="#facc15" />
        </div>
        <div style={{ color: '#fdba74' }}>
          <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4ade80' }}>✅</span> Web3 wallet connection
          </p>
          <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4ade80' }}>✅</span> Lisk Sepolia network support
          </p>
          <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4ade80' }}>✅</span> ArtPlatform contract integration
          </p>
          <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4ade80' }}>✅</span> Real-time balance updates
          </p>
          <p style={{ marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#4ade80' }}>✅</span> NFT minting with token rewards
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoContent;
