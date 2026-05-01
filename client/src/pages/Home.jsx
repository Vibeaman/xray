import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Wallet, ArrowRight } from 'lucide-react'
import FloatingIcons from '../components/FloatingIcons'

export default function Home() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-6">
      {/* Floating Line Art Icons */}
      <FloatingIcons />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Big Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-bold font-display tracking-tight mb-4">
            <span className="gradient-text">XRAY</span>
          </h1>
          <motion.div 
            className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed"
        >
          Expose the truth behind every profile.
          <br />
          <span className="opacity-60">Analyze accounts. Scan wallets. Get roasted.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/analyze">
            <motion.button
              className="btn-primary text-lg px-8 py-4 flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={22} />
              Analyze Profile
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <Link to="/wallet">
            <motion.button
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet size={22} />
              Scan Wallet
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating Detective Character */}
        <motion.div
          className="absolute -bottom-20 right-0 md:right-10 hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.img
            src="/detective-pepe.png"
            alt="Detective"
            className="w-40 h-40 object-contain drop-shadow-2xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  )
}
