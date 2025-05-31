import React from 'react';
import { Plus, Image, Zap, Bug } from 'lucide-react';

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
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
      background: 'rgba(0,0,0,0.2)',
      padding: '0.5rem',
      borderRadius: '16px',
      border: '1px solid rgba(250, 204, 21, 0.2)'
    }}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 'medium',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === id 
              ? 'linear-gradient(90deg, #eab308, #f97316)' 
              : 'transparent',
            color: activeTab === id ? '#581c87' : '#fdba74',
            boxShadow: activeTab === id ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== id) {
              e.currentTarget.style.color = '#fde047';
              e.currentTarget.style.background = 'rgba(250, 204, 21, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== id) {
              e.currentTarget.style.color = '#fdba74';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
