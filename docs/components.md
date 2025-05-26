# Components Directory

This directory contains all the React components for the ArtCrate NFT platform. Each component is properly separated and follows React best practices.

## Component Structure

### Core Components

- **Header.js** - Main navigation header with wallet connection
- **TokenBalance.js** - Displays user's CTK token balance
- **MintForm.js** - NFT minting interface with IPFS integration
- **Gallery.js** - NFT gallery display with grid layout
- **MintingLog.js** - Activity log showing minting history
- **StatsOverview.js** - Platform statistics dashboard
- **Navigation.js** - Tab navigation for different views
- **DemoContent.js** - Demo content for wallet connection state

### Component Features

#### Header
- Wallet connection/disconnection
- Network detection and switching
- Account balance display
- Responsive design

#### MintForm
- Image upload with preview
- Form validation
- IPFS integration
- Smart contract interaction
- Loading states and error handling

#### Gallery
- Grid layout for NFTs
- Hover effects and animations
- Responsive design
- Empty state handling

#### MintingLog
- Chronological activity display
- NFT thumbnails
- Reward tracking
- Formatted timestamps

#### TokenBalance
- Real-time balance updates
- Visual token representation
- Reward information

#### StatsOverview
- Platform metrics
- Grid layout
- Icon integration

#### Navigation
- Tab-based navigation
- Active state management
- Smooth transitions

## Usage

Import components individually:
```javascript
import Header from './components/Header';
import MintForm from './components/MintForm';
```

Or use the index file for multiple imports:
```javascript
import { Header, MintForm, Gallery } from './components';
```

## Styling

Components use inline styles for:
- Better component isolation
- No CSS conflicts
- Easier maintenance
- Consistent theming

## Dependencies

- React (hooks: useState, useEffect)
- lucide-react (icons)
- Web3Context (custom hook)
- IPFS utilities

## Best Practices

- Each component is in its own file
- Components are pure and functional
- Proper prop validation
- Consistent naming conventions
- Responsive design patterns
- Accessibility considerations
