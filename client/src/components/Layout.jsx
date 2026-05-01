import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Wallet, Sparkles, Twitter, Github, Mail, Linkedin } from 'lucide-react'
import { CREDITS } from '../config'

export default function Layout({ children, darkMode, setDarkMode }) {
  const location = useLocation()
  
  const navLinks = [
    { path: '/analyze', label: 'Analyze' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/pfp-studio', label: 'PFP Studio' },
  ]

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Gradient overlay for light mode */}
      {!darkMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-cyan-100/50 pointer-events-none" />
      )}

      {/* Social Icons - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
        <motion.a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Linkedin size={20} />
        </motion.a>
        <motion.a
          href="mailto:hello@xray.app"
          className="social-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail size={20} />
        </motion.a>
        <motion.a
          href="https://github.com/Vibeaman/xray"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github size={20} />
        </motion.a>
      </div>

      {/* Main Container with Neon Border */}
      <div className="relative min-h-screen p-4 md:p-8">
        <div className={`neon-container min-h-[calc(100vh-4rem)] ${darkMode ? '' : 'bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300'}`}>
          <div className="neon-container-inner min-h-[calc(100vh-4rem)]">
            
            {/* Navigation */}
            <nav className="flex items-center justify-between py-4 px-6 relative z-50">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl font-bold neon-text font-['Orbitron']"
                  whileHover={{ scale: 1.05 }}
                >
                  XRAY
                </motion.span>
              </Link>

              {/* Right Nav */}
              <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <motion.button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`toggle-switch ${!darkMode ? 'light' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle theme"
                />

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-4">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                      <Link key={link.path} to={link.path}>
                        <motion.span
                          className={`font-medium transition-all ${
                            isActive 
                              ? 'text-cyan-400' 
                              : darkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {link.label}
                        </motion.span>
                      </Link>
                    )
                  })}
                </div>

                {/* CTA Button */}
                <Link to="/analyze">
                  <motion.button
                    className="btn-neon text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start
                  </motion.button>
                </Link>
              </div>
            </nav>

            {/* Main Content */}
            <main className="relative">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-8 px-6 mt-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Credits */}
                <div className="flex items-center gap-6">
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
                      className="w-10 h-10 rounded-full ring-2 ring-pink-500/50 group-hover:ring-pink-500 transition-all"
                    />
                    <div className="text-sm">
                      <div className={darkMode ? 'text-white/50' : 'text-gray-500'}>Built by</div>
                      <div className="font-semibold neon-text-pink">{CREDITS.builder.name}</div>
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
                      className="w-10 h-10 rounded-full ring-2 ring-cyan-500/50 group-hover:ring-cyan-500 transition-all"
                    />
                    <div className="text-sm">
                      <div className={darkMode ? 'text-white/50' : 'text-gray-500'}>Idea by</div>
                      <div className="font-semibold text-cyan-400">{CREDITS.idea.name}</div>
                    </div>
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <a 
                    href="https://x.com/0xvibeaman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all ${darkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="https://github.com/Vibeaman/xray" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all ${darkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <Github size={20} />
                  </a>
                </div>
              </div>

              <div className={`mt-6 pt-6 border-t text-center text-sm ${darkMode ? 'border-white/10 text-white/30' : 'border-gray-200 text-gray-400'}`}>
                © 2026 XRay. Expose the truth. 🔍
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
