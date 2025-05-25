import React from 'react';
import { Image, Coins, Star } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

// Shared card styles
const cardStyles = {
  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(250, 204, 21, 0.3)',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
};

const StatsOverview = () => {
  const { mintedNFTs, tokenBalance } = useWeb3();
  const totalRewards = mintedNFTs.reduce((sum, nft) => sum + nft.reward, 0);

  const stats = [
    {
      label: 'Total NFTs',
      value: mintedNFTs.length,
      icon: Image,
      color: '#facc15'
    },
    {
      label: 'Tokens Earned',
      value: `${totalRewards} CTK`,
      icon: Coins,
      color: '#facc15'
    },
    {
      label: 'Total Balance',
      value: `${tokenBalance} CTK`,
      icon: Star,
      color: '#facc15'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#fdba74', fontSize: '0.875rem', margin: 0, marginBottom: '0.25rem' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {stat.value}
                </p>
              </div>
              <IconComponent size={32} color={stat.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
