import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Wallet, Sparkles, Zap, Shield, TrendingUp, ChevronRight } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Search,
      title: 'Profile Analysis',
      description: 'Deep dive into any Twitter/X account. Get scores, engagement metrics, and AI-powered insights.',
      color: 'purple'
    },
    {
      icon: Wallet,
      title: 'Wallet Scanner',
      description: 'Analyze any Solana or EVM wallet. Track holdings, activity, NFTs across multiple chains.',
      color: 'blue'
    },
    {
      icon: Sparkles,
      title: 'PFP Studio',
      description: 'Transform your profile picture with filters, seasonal themes, and AI-generated lore.',
      color: 'cyan'
    },
    {
      icon: Zap,
      title: 'Brutal Roasts',
      description: 'Get absolutely destroyed by our AI. No mercy. Pure entertainment.',
      color: 'pink'
    }
  ]

  const stats = [
    { value: '100K+', label: 'Profiles Analyzed' },
    { value: '50K+', label: 'Wallets Scanned' },
    { value: '∞', label: 'Dreams Crushed' }
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-400">Now with multi-chain wallet support</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Expose</span> the truth
                <br />
                behind every
                <br />
                <span className="gradient-text-fire">profile</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Analyze Twitter accounts and crypto wallets with AI-powered insights. 
                Get roasted. See the reality behind the flex.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/analyze">
                  <motion.button
                    className="btn-primary px-8 py-4 rounded-xl font-semibold text-white text-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search size={20} />
                    Analyze Profile
                  </motion.button>
                </Link>
                <Link to="/wallet">
                  <motion.button
                    className="btn-secondary px-8 py-4 rounded-xl font-semibold text-white text-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet size={20} />
                    Scan Wallet
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Detective Pepe */}
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Glow behind */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-soft" />
              </div>
              
              {/* Detective Pepe */}
              <motion.img
                src="/detective-pepe.png"
                alt="Detective Pepe"
                className="relative z-10 w-full max-w-md drop-shadow-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Floating badges */}
              <motion.div
                className="absolute top-10 right-10 glass rounded-xl px-4 py-2"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-2xl">🔍</span>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-0 glass rounded-xl px-4 py-2"
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span className="text-2xl">💀</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-0 glass rounded-xl px-4 py-2"
                animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <span className="text-2xl">🔥</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to <span className="gradient-text">investigate</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From profile analysis to wallet scanning, we've got the tools to expose anyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="glass-strong rounded-2xl p-6 card-3d"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                    <Icon className={`text-${feature.color}-400`} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to get <span className="gradient-text-fire">roasted</span>?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Enter any Twitter username or wallet address. 
                Our AI will analyze and absolutely destroy them.
              </p>
              <Link to="/analyze">
                <motion.button
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-white text-lg inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Now
                  <ChevronRight size={20} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
