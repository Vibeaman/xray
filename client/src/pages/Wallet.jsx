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
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <WalletIcon className="text-cyan-400" size={36} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Orbitron']">
            <span className="neon-text">SCAN WALLET</span>
          </h1>
          <p className="text-lg opacity-70">
            Analyze holdings across multiple chains
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          {/* Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <LinkIcon className="text-cyan-400" size={20} />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address (0x... or Solana)"
              className="w-full input-neon py-4 pl-14 pr-4 text-lg font-mono"
              disabled={loading}
            />
          </div>

          {/* Detected */}
          {address.length > 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-sm"
            >
              <span className="opacity-50">Detected: </span>
              <span className="text-cyan-400">{detectChain()}</span>
            </motion.div>
          )}

          {/* Chain Selection */}
          {isEVMAddress(address) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <label className="block text-sm opacity-70 mb-2">Select Chain</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChain('auto')}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    chain === 'auto' 
                      ? 'bg-pink-500/20 text-pink-400 ring-1 ring-pink-500' 
                      : 'glass-card hover:bg-white/5'
                  }`}
                >
                  Auto
                </button>
                {Object.entries(CHAINS).filter(([key]) => key !== 'solana').map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setChain(key)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      chain === key 
                        ? 'bg-pink-500/20 text-pink-400 ring-1 ring-pink-500' 
                        : 'glass-card hover:bg-white/5'
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

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full btn-neon py-4 text-lg flex items-center justify-center gap-2"
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
            <label className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-all">
              <input type="checkbox" className="rounded border-purple-500 bg-transparent text-pink-500" defaultChecked />
              <span className="text-sm">Include Roast</span>
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
          <p className="text-sm opacity-50 mb-3">Supported chains</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(CHAINS).map(([key, value]) => (
              <div
                key={key}
                className="px-3 py-1 glass-card text-xs flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: value.color }} />
                {value.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
