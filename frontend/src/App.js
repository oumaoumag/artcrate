import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import {
  Header,
  MintForm,
  Gallery,
  MintingLog,
  StatsOverview,
  NFTManager,
} from './components';
import AppLayout from './components/Layout/AppLayout';
import NFTDebugger from './components/NFTDebugger';
import { LAYOUT } from './styles/design-system';
import './App.css';

// Import debug utilities in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/debug-nfts').catch(console.error);
  import('./utils/ipfs-debug').catch(console.error);
  import('./utils/ipfs-fix').catch(console.error);
  import('./utils/check-nft').catch(console.error);
}

/**
 * Main App Component
 * Implements unified layout across all views
 * Uses Tailwind CSS and design system for consistent styling
 */
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('gallery'); // Default to gallery to show NFTs on load

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900 text-white font-sans">
      <Header />

      <main className="p-4 sm:p-6 lg:p-8 relative z-10">
        <div className={LAYOUT.container}>
          {/* Compact Hero Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
              Afrofuturistic Creator Economy
            </h2>
            <p className="text-orange-300 text-sm sm:text-base max-w-2xl mx-auto">
              Mint unique NFTs, earn Creator Tokens, and build your digital art empire
            </p>
          </div>

          {/* Compact Stats Overview */}
          <StatsOverview />

          {/* Main Content with Unified Layout */}
          <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'mint' && <MintForm />}
            {activeTab === 'gallery' && <Gallery />}
            {activeTab === 'activity' && <MintingLog />}
            {activeTab === 'manage' && <NFTManager />}
            {process.env.NODE_ENV === 'development' && activeTab === 'debug' && <NFTDebugger />}
          </AppLayout>
        </div>
      </main>

      <footer className="border-t border-yellow-400/30 bg-black/20 backdrop-blur-lg p-8 text-center relative z-10">
        <p className="text-orange-300">
          Built for the future of African digital art • Powered by Lisk Blockchain
        </p>
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