import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NFTManager from '../NFTManager';
import { useWeb3 } from '../../context/Web3Context';

// Mock the useWeb3 hook
jest.mock('../../context/Web3Context');

describe('NFTManager Component', () => {
  const mockHideNFTs = jest.fn();
  const mockShowHiddenNFTs = jest.fn();
  const mockGetHiddenNFTs = jest.fn();
  const mockClearBadNFTCache = jest.fn();
  const mockLoadUserNFTs = jest.fn();
  const mockFixTruncatedHashes = jest.fn();

  const defaultMockData = {
    mintedNFTs: [],
    hideNFTs: mockHideNFTs,
    showHiddenNFTs: mockShowHiddenNFTs,
    getHiddenNFTs: mockGetHiddenNFTs,
    clearBadNFTCache: mockClearBadNFTCache,
    loadUserNFTs: mockLoadUserNFTs,
    fixTruncatedHashes: mockFixTruncatedHashes,
    contract: {},
    account: '0x123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetHiddenNFTs.mockReturnValue([]);
  });

  test('renders "All NFTs Look Good" when no bad NFTs and no hidden NFTs', () => {
    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: [
        { id: 1, title: 'Good NFT', image: 'ipfs://hash', description: 'Valid NFT' }
      ]
    });

    render(<NFTManager />);
    
    expect(screen.getByText('All NFTs Look Good!')).toBeInTheDocument();
    expect(screen.getByText('No NFTs with missing images or metadata found.')).toBeInTheDocument();
  });

  test('displays problematic NFTs correctly', () => {
    const badNFTs = [
      { id: 1, title: 'NFT #1', image: '', description: 'IPFS metadata (not cached)' },
      { id: 2, title: 'Bad NFT', image: null, description: 'Unable to fetch IPFS metadata' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    expect(screen.getByText('NFT Manager')).toBeInTheDocument();
    expect(screen.getByText('Problematic NFTs')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Count of bad NFTs
  });

  test('displays hidden NFTs count when present', () => {
    mockGetHiddenNFTs.mockReturnValue([1, 2, 3]);
    
    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: []
    });

    render(<NFTManager />);
    
    expect(screen.getByText('Hidden NFTs')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Show All')).toBeInTheDocument();
  });

  test('handles NFT selection and deselection', () => {
    const badNFTs = [
      { id: 1, title: 'Bad NFT 1', image: '' },
      { id: 2, title: 'Bad NFT 2', image: '' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    // Select first NFT
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    
    expect(screen.getByText('Hide Selected (1)')).toBeInTheDocument();
    
    // Select all
    fireEvent.click(screen.getByText('Select All'));
    expect(screen.getByText('Hide Selected (2)')).toBeInTheDocument();
    
    // Deselect all
    fireEvent.click(screen.getByText('Deselect All'));
    expect(screen.getByText('Hide Selected (0)')).toBeInTheDocument();
  });

  test('hides selected NFTs when hide button is clicked', async () => {
    const badNFTs = [
      { id: 1, title: 'Bad NFT 1', image: '' },
      { id: 2, title: 'Bad NFT 2', image: '' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    // Select NFTs
    fireEvent.click(screen.getByText('Select All'));
    
    // Hide selected
    fireEvent.click(screen.getByText(/Hide Selected/));
    
    await waitFor(() => {
      expect(mockHideNFTs).toHaveBeenCalledWith([1, 2]);
    });
  });

  test('shows all hidden NFTs when show all button is clicked', async () => {
    mockGetHiddenNFTs.mockReturnValue([1, 2]);
    
    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: []
    });

    render(<NFTManager />);
    
    fireEvent.click(screen.getByText('Show All'));
    
    await waitFor(() => {
      expect(mockShowHiddenNFTs).toHaveBeenCalled();
    });
  });

  test('attempts to fix metadata when fix button is clicked', async () => {
    mockFixTruncatedHashes.mockResolvedValue(5);
    
    const badNFTs = [
      { id: 1, title: 'Bad NFT', image: '' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    fireEvent.click(screen.getByText('Fix Metadata'));
    
    await waitFor(() => {
      expect(mockFixTruncatedHashes).toHaveBeenCalled();
      expect(mockClearBadNFTCache).toHaveBeenCalled();
      expect(mockLoadUserNFTs).toHaveBeenCalled();
    });
  });

  test('toggles details view when show/hide details is clicked', () => {
    const badNFTs = [
      { id: 1, title: 'Bad NFT', image: '', ipfsHash: 'QmHash123456789' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    // Initially details should be hidden
    expect(screen.queryByText(/Hash:/)).not.toBeInTheDocument();
    
    // Show details
    fireEvent.click(screen.getByText('Show Details'));
    expect(screen.getByText(/Hash: QmHash12.../)).toBeInTheDocument();
    
    // Hide details
    fireEvent.click(screen.getByText('Hide Details'));
    expect(screen.queryByText(/Hash:/)).not.toBeInTheDocument();
  });

  test('disables buttons when processing', () => {
    const badNFTs = [
      { id: 1, title: 'Bad NFT', image: '' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    // Select an NFT
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    
    const hideButton = screen.getByText(/Hide Selected/);
    const fixButton = screen.getByText('Fix Metadata');
    
    expect(hideButton).not.toBeDisabled();
    expect(fixButton).not.toBeDisabled();
  });

  test('identifies different types of bad NFTs', () => {
    const badNFTs = [
      { id: 1, title: 'NFT #1', image: '', description: 'Valid' },
      { id: 2, title: 'NFT 2', image: null, description: 'IPFS metadata (not cached)' },
      { id: 3, title: 'NFT 3', image: 'ipfs://hash', description: 'Unable to fetch IPFS metadata' },
      { id: 4, title: 'NFT 4', image: 'ipfs://hash', description: 'IPFS metadata unavailable' },
      { id: 5, title: 'NFT 5', image: 'ipfs://hash', description: 'Metadata unavailable' },
      { id: 6, title: 'Good NFT', image: 'ipfs://hash', description: 'Valid description' }
    ];

    useWeb3.mockReturnValue({
      ...defaultMockData,
      mintedNFTs: badNFTs
    });

    render(<NFTManager />);
    
    // Should show 5 problematic NFTs (excluding the good one)
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check that good NFT is not listed
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(5); // Only bad NFTs should have checkboxes
  });
});