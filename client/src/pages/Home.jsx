import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Wallet, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Search,
      title: 'Profile Analysis',
      description: 'Deep dive into any Twitter/X account with AI-powered insights.',
      color: 'cyan'
    },
    {
      icon: Wallet,
      title: 'Wallet Scanner',
      description: 'Analyze Solana & EVM wallets across multiple chains.',
      color: 'pink'
    },
    {
      icon: Sparkles,
      title: 'PFP Studio',
      description: 'Transform your profile picture with retro filters.',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Brutal Roasts',
      description: 'Get absolutely destroyed by our AI. No mercy.',
      color: 'orange'
    }
  ]

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      {/* Neon Triangle */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:block">
        <motion.div
          className="triangle-outline animate-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Floating Detective Pepe */}
      <motion.div
        className="absolute left-[15%] top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.img
          src="/detective-pepe.png"
          alt="Detective Pepe"
          className="w-32 h-32 rounded-full ring-4 ring-cyan-500/50 object-cover"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-['Orbitron'] tracking-wider"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="neon-text">EXPOSE</span>
          <br />
          <span className="neon-text-pink">THE TRUTH</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-white/70 dark:text-white/70 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Analyze Twitter profiles and crypto wallets with AI-powered insights.
          <br />
          Get roasted. See the reality behind the flex.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/analyze">
            <motion.button
              className="btn-neon px-8 py-4 text-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
              Analyze Profile
            </motion.button>
          </Link>
          <Link to="/wallet">
            <motion.button
              className="btn-outline px-8 py-4 text-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet size={20} />
              Scan Wallet
            </motion.button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClasses = {
              cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
              pink: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
              purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
              orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
            }
            return (
              <motion.div
                key={feature.title}
                className={`glass-card p-6 retro-card border ${colorClasses[feature.color].split(' ').slice(1).join(' ')}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl ${colorClasses[feature.color].split(' ').slice(1, 2).join(' ')} flex items-center justify-center mb-4`}>
                  <Icon className={colorClasses[feature.color].split(' ')[0]} size={24} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-70">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
