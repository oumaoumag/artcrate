import React, { useState } from 'react';
import { Wallet, Plus, Image, Zap, Network } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { uploadToIPFS, uploadMetadataToIPFS, createNFTMetadata } from '../utils/ipfs';

// Shared styles
const cardStyles = {
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    marginBottom: '1.5rem'
};

const inputStyles = {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem'
};

const buttonStyles = {
    background: 'linear-gradient(90deg, #eab308, #f97316)',
    color: '#581c87',
    fontWeight: 'bold',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%'
};

const MintForm = () => {
    const { account, mintNFT, isCorrectNetwork } = useWeb3();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null
    });
    const [isMinting, setIsMinting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState('');


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMint = async (e) => {
        e.preventDefault();
        if (!account || !formData.title || !formData.image || !isCorrectNetwork) return;

        setIsMinting(true);

        try {
            // Upload image to IPFS (mock implementation)
            const imageUpload = await uploadToIPFS(formData.image);
            if (!imageUpload.success) throw new Error('Failed to upload image to IPFS');

            // Create and upload metadata
            const metadata = createNFTMetadata(
                formData.title,
                formData.description,
                imageUpload.url, 
                account
            );
            const metadataUpload = await uploadMetadataToIPFS(metadata);
            if (!metadataUpload.success) throw new Error('Failed to upload metadata to IPFS');
            
            // Mint NFT
            const receipt = await mintNFT(metadataUpload.url);
            console.log('NFT minted successfully:', receipt);

            // Reset form
            setFormData({ title: '', description: '', image: null });
            setPreview(null);
            alert('NFT minted successfully! You earned 10 CTK tokens.');
        } catch (error) {
            console.error('Minting error:', error);
            alert(`Failed to mint NFT: ${error.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    if (!account) {
        return (
            <div style={cardStyles}>
                <div style={{ textAlign: 'center' }}>
                    <Wallet size={64} color="#facc15" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', marginBottom: '0.5rem' }}>Connect Your Wallet</h3>
                    <p style={{ color: '#fdba74' }}>Connect your wallet to start minting NFTs and earning Creator Tokens</p>
                </div>
            </div>
        );
    }

    if (!isCorrectNetwork) {
        return (
            <div style={cardStyles}>
                <div style={{ textAlign: 'center' }}>
                    <Network size={64} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>Wrong Network</h3>
                    <p style={{ color: '#fdba74' }}>Please switch to Lisk Sepolia network to mint NFTs</p>
                </div>
            </div>
        );
    }

    return (
        <div style={cardStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Plus size={24} color="#facc15" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>Mint New NFT</h3>
            </div>

            <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', color: '#fdba74', fontWeight: 'medium', marginBottom: '0.5rem' }}>
                        Artwork Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={inputStyles}
                        placeholder="Enter your artwork title..."
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: '#fdba74', fontWeight: 'medium', marginBottom: '0.5rem' }}>
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ ...inputStyles, minHeight: '100px', resize: 'vertical' }}
                        placeholder="Describe your artwork..."
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: '#fdba74', fontWeight: 'medium', marginBottom: '0.5rem' }}>
                        Artwork Image
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="image-upload"
                            required
                        />
                        <label
                            htmlFor="image-upload"
                            style={{
                                display: 'block',
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                border: '2px dashed rgba(250, 204, 21, 0.3)',
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginBottom: '1rem'
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ maxHeight: '128px', borderRadius: '8px', marginBottom: '0.5rem' }} />
                            ) : (
                                <Image size={48} color="#facc15" style={{ margin: '0 auto 0.5rem' }} />
                            )}
                            <p style={{ color: '#fdba74', margin: 0 }}>
                                {preview ? 'Click to change image' : 'Click to upload image'}
                            </p>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isMinting || !formData.title || !formData.image}
                    style={{
                        ...buttonStyles,
                        opacity: (isMinting || !formData.title || !formData.image) ? 0.5 : 1,
                        cursor: (isMinting || !formData.title || !formData.image) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isMinting ? (
                        <>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #581c87',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Minting NFT...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={20} />
                            <span>Mint NFT & Earn 10 CTK</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MintForm;