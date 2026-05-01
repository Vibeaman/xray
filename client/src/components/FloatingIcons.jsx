import { motion } from 'framer-motion'

// SVG Line Icons Component - Flat illustration style
export function FloatingIcons({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Magnifying Glass */}
      <motion.svg
        className="absolute top-[15%] left-[10%] w-12 h-12 float-element"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <circle cx="20" cy="20" r="12" className="line-icon" />
        <line x1="28" y1="28" x2="40" y2="40" className="line-icon" strokeLinecap="round" />
      </motion.svg>

      {/* Monitor/Screen */}
      <motion.svg
        className="absolute top-[25%] right-[15%] w-14 h-14 float-element-delayed"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <rect x="6" y="8" width="36" height="24" rx="2" className="line-icon" />
        <line x1="24" y1="32" x2="24" y2="38" className="line-icon" />
        <line x1="16" y1="38" x2="32" y2="38" className="line-icon" strokeLinecap="round" />
        <polyline points="14,18 20,22 26,16 34,24" className="line-icon" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      {/* Wallet */}
      <motion.svg
        className="absolute bottom-[30%] left-[8%] w-10 h-10 float-element-slow"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <rect x="6" y="14" width="36" height="24" rx="3" className="line-icon" />
        <path d="M6 20h36" className="line-icon" />
        <circle cx="34" cy="28" r="3" className="line-icon" />
      </motion.svg>

      {/* Lightbulb */}
      <motion.svg
        className="absolute top-[40%] right-[8%] w-10 h-10 float-element"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <path d="M24 6C17 6 12 11 12 18c0 5 3 9 6 12v4h12v-4c3-3 6-7 6-12 0-7-5-12-12-12z" className="line-icon" />
        <line x1="18" y1="38" x2="30" y2="38" className="line-icon" strokeLinecap="round" />
        <line x1="20" y1="42" x2="28" y2="42" className="line-icon" strokeLinecap="round" />
      </motion.svg>

      {/* Code Brackets */}
      <motion.svg
        className="absolute bottom-[20%] right-[20%] w-12 h-12 float-element-delayed"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <polyline points="16,12 6,24 16,36" className="line-icon" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="32,12 42,24 32,36" className="line-icon" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      {/* Gear */}
      <motion.svg
        className="absolute top-[60%] left-[15%] w-10 h-10 float-element-slow"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <circle cx="24" cy="24" r="6" className="line-icon" />
        <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.5 9.5l4 4M34.5 34.5l4 4M9.5 38.5l4-4M34.5 13.5l4-4" className="line-icon" strokeLinecap="round" />
      </motion.svg>

      {/* Rocket */}
      <motion.svg
        className="absolute top-[10%] right-[30%] w-11 h-11 float-element"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <path d="M24 4c-8 8-10 20-10 28h20c0-8-2-20-10-28z" className="line-icon" />
        <circle cx="24" cy="20" r="3" className="line-icon" />
        <path d="M14 32l-4 8 8-4M34 32l4 8-8-4" className="line-icon" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      {/* Fire/Flame */}
      <motion.svg
        className="absolute bottom-[40%] right-[12%] w-9 h-9 float-element-delayed"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <path d="M24 4c0 8 8 12 8 20 0 8-6 12-8 12s-8-4-8-12c0-8 8-12 8-20z" className="line-icon" />
        <path d="M24 28c-2 0-4 2-4 6s2 6 4 6 4-2 4-6-2-6-4-6z" className="line-icon" />
      </motion.svg>

      {/* User Profile */}
      <motion.svg
        className="absolute top-[50%] left-[5%] w-10 h-10 float-element"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <circle cx="24" cy="16" r="8" className="line-icon" />
        <path d="M8 44c0-10 7-16 16-16s16 6 16 16" className="line-icon" strokeLinecap="round" />
      </motion.svg>

      {/* Chart Bars */}
      <motion.svg
        className="absolute bottom-[15%] left-[25%] w-10 h-10 float-element-slow"
        viewBox="0 0 48 48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <rect x="8" y="28" width="6" height="14" rx="1" className="line-icon" />
        <rect x="18" y="20" width="6" height="22" rx="1" className="line-icon" />
        <rect x="28" y="12" width="6" height="30" rx="1" className="line-icon" />
        <rect x="38" y="24" width="6" height="18" rx="1" className="line-icon" />
      </motion.svg>

      {/* Connecting Lines SVG */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M100,150 Q200,100 300,200 T500,180"
          className="connecting-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
          d="M600,100 Q700,250 800,150"
          className="connecting-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </svg>
    </div>
  )
}

export default FloatingIcons
