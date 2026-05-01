import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet as WalletIcon, Loader2, Link as LinkIcon, Flame } from 'lucide-react'
import { CHAINS } from '../config'

export default function Wallet() {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('auto')
  const [includeRoast, setIncludeRoast] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!address.trim()) return

    const chainParam = chain !== 'auto' ? `?chain=${chain}&roast=${includeRoast}` : `?roast=${includeRoast}`
    navigate(`/wallet/${address.trim()}${chainParam}`)
  }

  const isEVMAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)
  const isSolanaAddress = (addr) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)

  const detectChain = () => {
    if (isEVMAddress(address)) return 'EVM'
    if (isSolanaAddress(address)) return 'Solana'
    return null
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 dark:bg-white/10 mb-6 shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <WalletIcon size={36} className="opacity-80" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            Scan Wallet
          </h1>
          <p className="text-lg opacity-60">
            Analyze any wallet across chains
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="solid-card p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 z-10 pointer-events-none">
              <LinkIcon size={20} className="opacity-40" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or Solana address"
              className="input-field text-lg font-mono"
              style={{ paddingLeft: '52px' }}
              disabled={loading}
            />
          </div>

          {/* Detected */}
          {address.length > 10 && detectChain() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm"
            >
              <span className="opacity-50">Detected: </span>
              <span className="font-medium">{detectChain()}</span>
            </motion.div>
          )}

          {/* Chain Selection */}
          {isEVMAddress(address) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <label className="block text-sm opacity-60 mb-2">Select Chain</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChain('auto')}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    chain === 'auto' 
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white' 
                      : 'bg-white/10 hover:bg-white/20'
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
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Options */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeRoast}
                onChange={(e) => setIncludeRoast(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-current text-orange-500 focus:ring-orange-500"
              />
              <span className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <Flame size={18} className="text-orange-500" />
                Include Roast
              </span>
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !address.trim()}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <WalletIcon size={22} />
                Scan
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Supported */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm opacity-40 mb-3">Supported chains</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(CHAINS).map(([key, value]) => (
              <div
                key={key}
                className="px-3 py-1 rounded-lg bg-white/10 text-xs flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: value.color }} />
                {value.name}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
