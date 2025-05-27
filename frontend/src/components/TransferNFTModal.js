import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Send } from 'lucide-react';

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(234, 88, 12, 0.8))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(250, 204, 21, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'none',
        border: 'none',
        color: '#fde047',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(250, 204, 21, 0.3)',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '1rem',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.75rem',
        backgroundColor: 'rgba(250, 204, 21, 0.8)',
        border: 'none',
        borderRadius: '8px',
        color: '#581c87',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    nftPreview: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '0.75rem',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
    },
    nftImage: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    nftInfo: {
        flex: 1,
    },
};

const TransferNFTModal = ({ nft, onClose }) => {
    const { transferNFT } = useWeb3();
    const [recipient, setRecipient] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);
    const [error, setError] = useState('');

    const handleTransfer = async () => {
        if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
            setError('Please enter a valid Ethereum address');
            return;
        }

        setError('');
        setIsTransferring(true);

        try {
            await transferNFT(recipient, nft.id);
            alert(`NFT #${nft.id} successfully transferred to ${recipient}`);
            onClose();
        } catch (error) {
            console.error('Transfer error:', error);
            setError(error.message || 'Failed to transfer NFT');
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                <button style={modalStyles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>

                <h3 style={{ color: '#fde047', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Transfer NFT
                </h3>

                <div style={modalStyles.nftPreview}>
                    <img 
                        src={nft.image || 'https://via.placeholder.com/60?text=NFT'} 
                        alt={nft.title}
                        style={modalStyles.nftImage}
                    />
                    <div style={modalStyles.nftInfo}>
                        <div style={{ color: '#fde047', fontWeight: 'bold' }}>{nft.title}</div>
                        <div style={{ color: '#fdba74', fontSize: '0.875rem' }}>ID: {nft.id}</div>
                    </div>
                </div>

                <label style={{ color: '#fdba74', display: 'block', marginBottom: '0.5rem' }}>
                    Recipient Address
                </label>
                <input
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={modalStyles.input}
                />

                {error && (
                    <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleTransfer}
                    disabled={isTransferring}
                    style={{
                        ...modalStyles.button,
                        opacity: isTransferring ? 0.7 : 1,
                        cursor: isTransferring ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isTransferring ? (
                        <>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #581c87',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Transferring...</span>
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            <span>Transfer NFT</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TransferNFTModal;