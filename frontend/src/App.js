import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import {
  Header,
  TokenBalance,
  MintForm,
  Gallery,
  MintingLog,
  StatsOverview,
  Navigation,
  DemoContent
} from './components';
import './App.css';

// Import debug utility in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/debug-nfts').catch(console.error);
}

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

// Main App Content with Navigation
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('mint');

  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.heroSection}>
            <h2 style={styles.heroTitle}>
              Afrofuturistic Creator Economy
            </h2>
            <p style={styles.heroSubtitle}>
              Mint unique NFTs, earn Creator Tokens, and build your digital art empire in the metaverse
            </p>
          </div>

          <StatsOverview />

          <div style={styles.grid}>
            <TokenBalance />
            <div>
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

              {activeTab === 'mint' && <MintForm />}
              {activeTab === 'gallery' && <Gallery />}
              {activeTab === 'activity' && <MintingLog />}
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={{ color: '#fdba74', margin: 0 }}>
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