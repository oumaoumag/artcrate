import React from 'react';
import { render, screen } from '@testing-library/react';
import TokenBalance from '../TokenBalance';
import { useWeb3 } from '../../context/Web3Context';

// Mock the Web3 context
jest.mock('../../context/Web3Context', () => ({
  useWeb3: jest.fn()
}));

describe('TokenBalance Component', () => {
  const mockTokenBalance = '100';

  beforeEach(() => {
    useWeb3.mockReturnValue({
      tokenBalance: mockTokenBalance
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders full variant correctly', () => {
    render(<TokenBalance variant="full" />);
    
    // Check for title
    expect(screen.getByText('Creator Tokens')).toBeInTheDocument();
    
    // Check for balance
    expect(screen.getByText(mockTokenBalance)).toBeInTheDocument();
    
    // Check for CTK Balance label
    expect(screen.getByText('CTK Balance')).toBeInTheDocument();
    
    // Check for description
    expect(screen.getByText(/Earn 10 CTK for each NFT you mint/)).toBeInTheDocument();
  });

  test('renders compact variant correctly', () => {
    render(<TokenBalance variant="compact" />);
    
    // Check for balance
    expect(screen.getByText(mockTokenBalance)).toBeInTheDocument();
    
    // Check for compact label
    expect(screen.getByText('Creator Tokens')).toBeInTheDocument();
    
    // Check for hint
    expect(screen.getByText('+10 CTK per mint')).toBeInTheDocument();
    
    // Should not have the full description
    expect(screen.queryByText(/Build your creator economy/)).not.toBeInTheDocument();
  });

  test('defaults to full variant when no variant specified', () => {
    render(<TokenBalance />);
    
    // Should have full variant elements
    expect(screen.getByText('CTK Balance')).toBeInTheDocument();
    expect(screen.getByText(/Build your creator economy/)).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<TokenBalance className={customClass} />);
    
    const element = container.firstChild;
    expect(element).toHaveClass(customClass);
  });
});