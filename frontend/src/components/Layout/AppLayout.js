import React from 'react';
import { LAYOUT, cn } from '../../styles/design-system';
import TokenBalance from '../TokenBalance';
import Navigation from '../Navigation';

/**
 * Unified App Layout Component
 * Handles responsive layout for all views with consistent token balance display
 * Implements the optimized layout pattern across all tabs
 */
const AppLayout = ({ 
  activeTab, 
  setActiveTab, 
  children, 
  className = '',
  showCompactToken = true 
}) => {
  
  return (
    <div className={cn(LAYOUT.grid.compact, className)}>
      {/* Compact Token Balance - Always shown at top */}
      {showCompactToken && (
        <TokenBalance variant="compact" />
      )}
      
      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area - Full Width */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;