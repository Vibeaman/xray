import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet as WalletIcon, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react'
import { CHAINS } from '../config'

export default function Wallet() {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('auto')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!address.trim()) return

    setLoading(true)
    setError('')

    // Navigate to results
    const chainParam = chain !== 'auto' ? `?chain=${chain}` : ''
    navigate(`/wallet/${address.trim()}${chainParam}`)
  }

  const isEVMAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)
  const isSolanaAddress = (addr) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)

  const detectChain = () => {
    if (isEVMAddress(address)) return 'EVM (Ethereum/BSC/Base...)'
    if (isSolanaAddress(address)) return 'Solana'
    return 'Unknown'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/20 mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <WalletIcon className="text-blue-400" size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Scan any <span className="gradient-text">wallet</span>
          </h1>
          <p className="text-xl text-gray-400">
            Analyze holdings, activity, and get roasted across multiple chains
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-2xl p-8"
        >
          {/* Address Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <LinkIcon className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address (0x... or Solana)"
              className="w-full input-dark rounded-xl py-4 pl-12 pr-4 text-lg font-mono"
              disabled={loading}
            />
          </div>

          {/* Detected Chain */}
          {address.length > 10 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-sm"
            >
              <span className="text-gray-500">Detected: </span>
              <span className="text-purple-400">{detectChain()}</span>
            </motion.div>
          )}

          {/* Chain Selection (for EVM) */}
          {isEVMAddress(address) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <label className="block text-sm text-gray-400 mb-2">Select Chain</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChain('auto')}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    chain === 'auto' 
                      ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500' 
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  Auto-detect
                </button>
                {Object.entries(CHAINS).filter(([key]) => key !== 'solana').map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setChain(key)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      chain === key 
                        ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500' 
                        : 'glass hover:bg-white/5'
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 mb-4"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full btn-primary py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !address.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Scanning...
              </>
            ) : (
              <>
                <WalletIcon size={20} />
                Scan Wallet
              </>
            )}
          </motion.button>

          {/* Options */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-dark-700 text-purple-500" defaultChecked />
              <span className="text-sm">Include Roast</span>
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-dark-700 text-purple-500" />
              <span className="text-sm">Multi-chain Scan</span>
            </label>
          </div>
        </motion.form>

        {/* Supported Chains */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm mb-3">Supported chains</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(CHAINS).map(([key, value]) => (
              <div
                key={key}
                className="px-3 py-1 glass rounded-lg text-xs text-gray-400 flex items-center gap-2"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: value.color }}
                />
                {value.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
