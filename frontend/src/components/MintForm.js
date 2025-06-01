import React, { useState } from 'react';
import { Wallet, Plus, Image, Zap, Network } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { uploadToIPFS, uploadMetadataToIPFS, createNFTMetadata } from '../utils/ipfs';
import { CARD_CLASSES, TYPOGRAPHY, LAYOUT, ICONS, INTERACTIVE, STATUS, cn } from '../styles/design-system';

/**
 * MintForm Component - Refactored with Tailwind
 * Handles NFT minting with IPFS upload
 */
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
        setUploadProgress('');

        try {
            // Upload image to IPFS
            const imageUpload = await uploadToIPFS(formData.image, setUploadProgress);
            if (!imageUpload.success) throw new Error('Failed to upload image to IPFS');

            setUploadProgress('Creating metadata...');
            const metadata = createNFTMetadata(
                formData.title,
                formData.description,
                imageUpload.url, 
                account
            );
            
            setUploadProgress('Uploading metadata to IPFS...');
            const metadataUpload = await uploadMetadataToIPFS(metadata);
            if (!metadataUpload.success) throw new Error('Failed to upload metadata to IPFS');
            
            setUploadProgress('Minting NFT on blockchain...');
            const receipt = await mintNFT(metadataUpload.url);
            console.log('NFT minted successfully:', receipt);

            // Reset form
            setFormData({ title: '', description: '', image: null });
            setPreview(null);
            setUploadProgress('');
            alert('NFT minted successfully! You earned 10 CTK tokens.');
        } catch (error) {
            console.error('Minting error:', error);
            setUploadProgress(`Error: ${error.message}`);
            alert(`Failed to mint NFT: ${error.message}`);
        } finally {
            setIsMinting(false);
        }
    };

    // Wallet not connected state
    if (!account) {
        return (
            <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default, CARD_CLASSES.spacing.default)}>
                <div className="text-center">
                    <Wallet size={ICONS.sizes.hero} color={ICONS.colors.primary} className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">Connect Your Wallet</h3>
                    <p className={TYPOGRAPHY.body.secondary}>
                        Connect your wallet to start minting NFTs and earning Creator Tokens
                    </p>
                </div>
            </div>
        );
    }

    // Wrong network state
    if (!isCorrectNetwork) {
        return (
            <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default, CARD_CLASSES.spacing.default)}>
                <div className="text-center">
                    <Network size={ICONS.sizes.hero} color="#ef4444" className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">Wrong Network</h3>
                    <p className={TYPOGRAPHY.body.secondary}>
                        Please switch to Lisk Sepolia network to mint NFTs
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(CARD_CLASSES.base, CARD_CLASSES.padding.default, CARD_CLASSES.spacing.default)}>
            <div className={cn(LAYOUT.flex.start, "mb-6")}>
                <Plus size={ICONS.sizes.large} color={ICONS.colors.primary} />
                <h3 className={TYPOGRAPHY.heading.primary}>Mint New NFT</h3>
            </div>

            <form onSubmit={handleMint} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label className="block text-orange-300 font-medium mb-2">
                        Artwork Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={INTERACTIVE.input.base}
                        placeholder="Enter your artwork title..."
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label className="block text-orange-300 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={INTERACTIVE.input.textarea}
                        placeholder="Describe your artwork..."
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-orange-300 font-medium mb-2">
                        Artwork Image
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                            required
                        />
                        <label
                            htmlFor="image-upload"
                            className="block w-full bg-black/30 border-2 border-dashed border-yellow-400/30 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-yellow-400/50 hover:bg-black/40"
                        >
                            {preview ? (
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="max-h-32 rounded-lg mb-2 mx-auto" 
                                />
                            ) : (
                                <Image 
                                    size={ICONS.sizes.xlarge * 1.5} 
                                    color={ICONS.colors.primary} 
                                    className="mx-auto mb-2" 
                                />
                            )}
                            <p className={TYPOGRAPHY.body.secondary}>
                                {preview ? 'Click to change image' : 'Click to upload image'}
                            </p>
                        </label>
                    </div>
                </div>

                {/* Upload Progress */}
                {uploadProgress && (
                    <div className={cn(
                        "flex items-center gap-2 p-3 bg-black/20 rounded-lg",
                        uploadProgress.includes('Error') ? STATUS.error : STATUS.success
                    )}>
                        {uploadProgress.includes('Error') ? (
                            <span>⚠️</span>
                        ) : (
                            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{uploadProgress}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isMinting || !formData.title || !formData.image}
                    className={cn(
                        INTERACTIVE.button.primary,
                        "w-full"
                    )}
                >
                    {isMinting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin" />
                            <span>Minting NFT...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={ICONS.sizes.medium} />
                            <span>Mint NFT & Earn 10 CTK</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default MintForm;