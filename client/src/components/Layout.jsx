import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon, Search, Wallet, Sparkles, Twitter, Github } from 'lucide-react'
import { CREDITS } from '../config'

export default function Layout({ children, darkMode, setDarkMode }) {
  const location = useLocation()
  
  const navLinks = [
    { path: '/analyze', label: 'Analyze', icon: Search },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/pfp-studio', label: 'PFP Studio', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float-slower" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="text-2xl font-bold gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                XRay
              </motion.div>
              <span className="text-xs text-gray-500 font-mono">v1.0</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* CTA Button */}
              <Link to="/analyze">
                <motion.button
                  className="btn-primary px-4 py-2 rounded-lg font-semibold text-white text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Analyzing
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-16 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative glass mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Credits */}
            <div className="flex items-center gap-6">
              {/* Built by */}
              <a 
                href={CREDITS.builder.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
              >
                <img 
                  src={CREDITS.builder.avatar} 
                  alt={CREDITS.builder.name}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500/50 group-hover:ring-purple-500 transition-all"
                />
                <div className="text-sm">
                  <div className="text-gray-500">Built by</div>
                  <div className="font-semibold gradient-text">{CREDITS.builder.name}</div>
                </div>
              </a>

              {/* Idea by */}
              <a 
                href={CREDITS.idea.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
              >
                <img 
                  src={CREDITS.idea.avatar} 
                  alt={CREDITS.idea.name}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition-all"
                />
                <div className="text-sm">
                  <div className="text-gray-500">Idea by</div>
                  <div className="font-semibold text-blue-400">{CREDITS.idea.name}</div>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://x.com/0xvibeaman" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://github.com/Vibeaman/xray" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-gray-500 text-sm">
            © 2026 XRay. Analyze profiles. Expose the truth. 🔍
          </div>
        </div>
      </footer>
    </div>
  )
}
