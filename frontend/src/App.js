import React, { useState } from 'react';
import { Wallet, Plus, Image, Coins, Zap, Network, User, Star } from 'lucide-react';
import { Web3Provider, useWeb3 } from './context/Web3Context';
import './App.css';

// Simple inline styles for demo
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #ea580c 100%)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
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
  },
  main: {
    padding: '2rem',
    position: 'relative',
    zIndex: 10
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #fde047, #fdba74)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    color: '#fdba74',
    fontSize: '1.125rem',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(234, 88, 12, 0.5))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    marginBottom: '1.5rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#fde047',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  button: {
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
    gap: '0.5rem'
  },
  input: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  textarea: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    minHeight: '100px',
    resize: 'vertical'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
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
  },
  preview: {
    maxHeight: '128px',
    borderRadius: '8px',
    marginBottom: '0.5rem'
  },
  footer: {
    borderTop: '1px solid rgba(250, 204, 21, 0.3)',
    background: 'rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10
  }
};

// Header Component
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

// Token Balance Component
const TokenBalance = () => {
  const { tokenBalance } = useWeb3();

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-yellow-300">Creator Tokens</h3>
        <Coins className="w-6 h-6 text-yellow-400" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Coins className="w-8 h-8 text-purple-900" />
        </div>
        <div>
          <p className="text-3xl font-bold text-white">{tokenBalance}</p>
          <p className="text-orange-300">CTK Balance</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-black/20 rounded-xl border border-yellow-400/20">
        <p className="text-sm text-orange-200">
          Earn 10 CTK for each NFT you mint • Build your creator economy
        </p>
      </div>
    </div>
  );
};

// Mint Form Component
const MintForm = () => {
  const { account, mintNFT, isCorrectNetwork } = useWeb3();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [isMinting, setIsMinting] = useState(false);
  const [preview, setPreview] = useState(null);

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
      // In a real implementation, you would upload to IPFS here
      // For demo purposes, we'll create a mock metadata URI
      const mockMetadataURI = `https://ipfs.io/ipfs/Qm${Math.random().toString(36).substring(2, 15)}`;

      // Call the smart contract mint function
      const receipt = await mintNFT(mockMetadataURI);

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
      <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8 shadow-2xl text-center">
        <Wallet className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-yellow-300 mb-2">Connect Your Wallet</h3>
        <p className="text-orange-200">Connect your wallet to start minting NFTs and earning Creator Tokens</p>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8 shadow-2xl text-center">
        <Network className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-300 mb-2">Wrong Network</h3>
        <p className="text-orange-200">Please switch to Lisk Sepolia network to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Plus className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-yellow-300">Mint New NFT</h3>
      </div>

      <form onSubmit={handleMint} className="space-y-6">
        <div>
          <label className="block text-orange-200 font-medium mb-2">Artwork Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/30 border border-yellow-400/30 rounded-xl px-4 py-3 text-white placeholder-orange-300/50 focus:border-yellow-400 focus:outline-none transition-colors"
            placeholder="Enter your artwork title..."
            required
          />
        </div>

        <div>
          <label className="block text-orange-200 font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-black/30 border border-yellow-400/30 rounded-xl px-4 py-3 text-white placeholder-orange-300/50 focus:border-yellow-400 focus:outline-none transition-colors h-24 resize-none"
            placeholder="Describe your artwork..."
          />
        </div>

        <div>
          <label className="block text-orange-200 font-medium mb-2">Artwork Image</label>
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
              className="block w-full bg-black/30 border border-yellow-400/30 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-yellow-400 transition-colors"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg mb-2" />
              ) : (
                <Image className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              )}
              <p className="text-orange-200">
                {preview ? 'Click to change image' : 'Click to upload image'}
              </p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isMinting || !formData.title || !formData.image}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-purple-900 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isMinting ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Minting NFT...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Mint NFT & Earn 10 CTK</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Minting Log Component
const MintingLog = () => {
  const { mintedNFTs } = useWeb3();

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-yellow-300">Minting Activity</h3>
      </div>

      {mintedNFTs.length === 0 ? (
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-orange-300/50 mx-auto mb-3" />
          <p className="text-orange-200">No NFTs minted yet</p>
          <p className="text-orange-300/70 text-sm">Start creating to see your minting history</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mintedNFTs.map((nft) => (
            <div key={nft.id} className="bg-black/20 rounded-xl p-4 border border-yellow-400/20">
              <div className="flex items-center space-x-4">
                {nft.image && (
                  <img src={nft.image} alt={nft.title} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h4 className="text-white font-bold">{nft.title}</h4>
                  <p className="text-orange-200 text-sm">
                    {new Date(nft.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">+{nft.reward} CTK</span>
                  </div>
                  <p className="text-green-400 text-sm">Minted</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Gallery Component
const Gallery = () => {
  const { mintedNFTs } = useWeb3();

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Image className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-yellow-300">NFT Gallery</h3>
      </div>

      {mintedNFTs.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-orange-300/50 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-orange-200 mb-2">Gallery Coming Soon</h4>
          <p className="text-orange-300/70">Mint your first NFT to start building your collection</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mintedNFTs.map((nft) => (
            <div key={nft.id} className="bg-black/30 rounded-xl border border-yellow-400/20 overflow-hidden hover:border-yellow-400/50 transition-colors group">
              <div className="aspect-square">
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-orange-600 flex items-center justify-center">
                    <Image className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2">{nft.title}</h4>
                {nft.description && (
                  <p className="text-orange-200 text-sm mb-3 line-clamp-2">{nft.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-orange-300 text-sm font-mono">
                    {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Coins className="w-3 h-3" />
                    <span className="text-xs font-bold">+{nft.reward}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Stats Component
const StatsOverview = () => {
  const { mintedNFTs, tokenBalance } = useWeb3();
  const totalRewards = mintedNFTs.reduce((sum, nft) => sum + nft.reward, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-200 text-sm">Total NFTs</p>
            <p className="text-2xl font-bold text-white">{mintedNFTs.length}</p>
          </div>
          <Image className="w-8 h-8 text-yellow-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-200 text-sm">Tokens Earned</p>
            <p className="text-2xl font-bold text-white">{totalRewards} CTK</p>
          </div>
          <Coins className="w-8 h-8 text-yellow-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-800/50 to-orange-800/50 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-200 text-sm">Total Balance</p>
            <p className="text-2xl font-bold text-white">{tokenBalance} CTK</p>
          </div>
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mint', label: 'Create', icon: Plus },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'activity', label: 'Activity', icon: Zap }
  ];

  return (
    <div className="flex space-x-2 mb-8 bg-black/20 p-2 rounded-2xl border border-yellow-400/20">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === id
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 shadow-lg'
            : 'text-orange-200 hover:text-yellow-300 hover:bg-yellow-400/10'
            }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('mint');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,193,7,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      <Header />

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text mb-4">
              Afrofuturistic Creator Economy
            </h2>
            <p className="text-orange-200 text-lg max-w-2xl mx-auto">
              Mint unique NFTs, earn Creator Tokens, and build your digital art empire in the metaverse
            </p>
          </div>

          <StatsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <TokenBalance />
            </div>
            <div className="lg:col-span-2">
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'mint' && <MintForm />}
              {activeTab === 'gallery' && <Gallery />}
              {activeTab === 'activity' && <MintingLog />}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-yellow-400/30 bg-black/20 backdrop-blur-sm py-8 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-orange-200">
            Built for the future of African digital art • Powered by Lisk Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Web3 Provider
function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;