import React, { useState } from 'react';
import { Image, Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { NFTCard } from './NFTCard'

// Helper function to handle different image URL formats
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    // If it's a data URL, return as is
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // If it's already a full URL (including IPFS gateway)
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If it's an IPFS URL with ipfs:// protocol
    if (imageUrl.startsWith('ipfs://')) {
        return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    // If it's just an IPFS hash
    if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
        return `https://ipfs.io/ipfs/${imageUrl}`;
    }
    
    // Default case - assume it's an IPFS hash or path
    return `https://ipfs.io/ipfs/${imageUrl}`;
};

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


const Gallery = () => {
    const { mintedNFTs } = useWeb3();

    return (
        <div style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Image size={24} color="#facc15" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>NFT Gallery</h3>
            </div>

            {mintedNFTs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <Image size={64} color="rgba(253, 186, 116, 0.5)" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fdba74', marginBottom: '0.5rem' }}>Gallery Coming Soon</h4>
                    <p style={{ color: 'rgba(253, 186, 116, 0.7)' }}>Mint your first NFT to start building your collection</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {mintedNFTs.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;