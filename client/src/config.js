// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://xray-production-72a7.up.railway.app'

export const APP_NAME = 'CloutCheck'
export const APP_TAGLINE = 'Are they building or just chasing clout?';

// Social links
export const SOCIAL_LINKS = {
  twitter: 'https://x.com/xray_app',
  github: 'https://github.com/Vibeaman/xray'
};

// Credits
export const CREDITS = {
  builder: {
    name: 'VIBÆMAN',
    twitter: 'https://x.com/0xvibeaman',
    avatar: '/avatars/vibeaman.jpg'
  },
  idea: {
    name: 'jid3nisweb3',
    twitter: 'https://x.com/jid3nisweb3',
    avatar: '/avatars/jid3nisweb3.jpg'
  }
};

// Supported chains
export const CHAINS = {
  solana: { name: 'Solana', symbol: 'SOL', color: '#9945FF' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  bsc: { name: 'BNB Chain', symbol: 'BNB', color: '#F3BA2F' },
  base: { name: 'Base', symbol: 'ETH', color: '#0052FF' },
  polygon: { name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
  arbitrum: { name: 'Arbitrum', symbol: 'ETH', color: '#28A0F0' }
};

// Tier colors
export const TIER_COLORS = {
  S: { bg: 'from-yellow-400 to-amber-500', text: 'text-black', glow: 'shadow-yellow-500/30' },
  A: { bg: 'from-purple-500 to-violet-600', text: 'text-white', glow: 'shadow-purple-500/30' },
  B: { bg: 'from-blue-500 to-blue-600', text: 'text-white', glow: 'shadow-blue-500/30' },
  C: { bg: 'from-emerald-500 to-green-600', text: 'text-white', glow: 'shadow-emerald-500/30' },
  D: { bg: 'from-orange-500 to-orange-600', text: 'text-white', glow: 'shadow-orange-500/30' },
  F: { bg: 'from-red-500 to-red-600', text: 'text-white', glow: 'shadow-red-500/30' }
};
