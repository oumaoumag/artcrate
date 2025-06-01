import React from 'react';
import { Plus, Image, Zap, Bug } from 'lucide-react';
import { ICONS, cn } from '../styles/design-system';

/**
 * Navigation Component - Refactored with Tailwind
 * Tab navigation with responsive design
 */
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'mint', label: 'Create', icon: Plus },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'activity', label: 'Activity', icon: Zap }
  ];
  
  // Add debug tab in development
  if (process.env.NODE_ENV === 'development') {
    tabs.push({ id: 'debug', label: 'Debug', icon: Bug });
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-2 rounded-2xl border border-yellow-400/20">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 border-none cursor-pointer",
            activeTab === id 
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-purple-900 shadow-lg" 
              : "bg-transparent text-orange-300 hover:text-yellow-300 hover:bg-yellow-400/10"
          )}
        >
          <Icon size={ICONS.sizes.small} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;