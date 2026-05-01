import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Wallet, Sparkles, Twitter, Github } from 'lucide-react'
import { CREDITS, APP_NAME } from '../config'

export default function Layout({ children, darkMode, setDarkMode }) {
  const location = useLocation()
  
  const navLinks = [
    { path: '/analyze', label: 'Analyze', icon: Search },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/pfp-studio', label: 'PFP Studio', icon: Sparkles },
  ]

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.span 
                className="text-2xl font-bold font-display gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                {APP_NAME}
              </motion.span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-white/20 dark:bg-white/10' 
                          : 'hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`theme-toggle ${darkMode ? 'active' : ''}`}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              />

              {/* CTA */}
              <Link to="/analyze" className="hidden sm:block">
                <motion.button
                  className="btn-primary text-sm px-6 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Credits */}
              <div className="flex items-center gap-8">
                {/* Built by */}
                <a 
                  href={CREDITS.builder.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <img 
                    src={CREDITS.builder.avatar} 
                    alt={CREDITS.builder.name}
                    className="w-12 h-12 rounded-full ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-lg"
                  />
                  <div>
                    <div className="text-sm opacity-60">Built by</div>
                    <div className="font-semibold">{CREDITS.builder.name}</div>
                  </div>
                </a>

                {/* Idea by */}
                <a 
                  href={CREDITS.idea.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <img 
                    src={CREDITS.idea.avatar} 
                    alt={CREDITS.idea.name}
                    className="w-12 h-12 rounded-full ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-lg"
                  />
                  <div>
                    <div className="text-sm opacity-60">Idea by</div>
                    <div className="font-semibold">{CREDITS.idea.name}</div>
                  </div>
                </a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://x.com/0xvibeaman" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://github.com/Vibeaman/xray" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm opacity-50">
              © 2026 CloutCheck. Are they building or just chasing clout? 🔍
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
