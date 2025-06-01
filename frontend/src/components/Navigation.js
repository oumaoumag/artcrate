import React from 'react';
import { Plus, Image, Zap, Bug, Settings } from 'lucide-react';
import { ICONS, cn } from '../styles/design-system';

/**
 * Navigation Component - Refactored with Tailwind
 * Tab navigation with responsive design
 */
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mint', label: 'Create', icon: Plus },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'activity', label: 'Activity', icon: Zap },
    { id: 'manage', label: 'Manage', icon: Settings }
  ];
  
  // Add debug tab in development
  if (process.env.NODE_ENV === 'development') {
    tabs.push({ id: 'debug', label: 'Debug', icon: Bug });
  }

  return (
    <div className="flex flex-wrap gap-1 mb-3 bg-black/20 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-yellow-400/20">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all duration-300 border-none cursor-pointer text-xs sm:text-sm",
            activeTab === id 
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 shadow-lg" 
              : "bg-transparent text-orange-300 hover:text-yellow-300 hover:bg-yellow-400/10"
          )}
        >
          <Icon size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;