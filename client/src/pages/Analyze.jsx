import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, AtSign, Loader2, AlertCircle } from 'lucide-react'

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError('')

    const cleanUsername = username.trim().replace(/^@/, '')
    navigate(`/results/${cleanUsername}`)
  }

  const popularAccounts = [
    { username: 'elonmusk', label: 'Elon' },
    { username: 'naval', label: 'Naval' },
    { username: 'VitalikButerin', label: 'Vitalik' },
    { username: 'cobie', label: 'Cobie' },
  ]

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-pink-500/30 mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Search className="text-cyan-400" size={36} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Orbitron']">
            <span className="neon-text">ANALYZE</span>
          </h1>
          <p className="text-lg opacity-70">
            Enter a Twitter/X username to get the full breakdown
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
              <AtSign className="text-purple-400" size={20} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full input-neon py-4 pl-14 pr-4 text-lg"
              disabled={loading}
            />
          </div>

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
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />
                Analyze Profile
              </>
            )}
          </motion.button>

          {/* Options */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <label className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-all">
              <input type="checkbox" className="rounded border-purple-500 bg-transparent text-pink-500" defaultChecked />
              <span className="text-sm">Include Roast</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-all">
              <input type="checkbox" className="rounded border-purple-500 bg-transparent text-pink-500" defaultChecked />
              <span className="text-sm">Rate PFP</span>
            </label>
          </div>
        </motion.form>

        {/* Popular */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm opacity-50 mb-3">Try these</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularAccounts.map((account) => (
              <motion.button
                key={account.username}
                onClick={() => setUsername(account.username)}
                className="px-4 py-2 glass-card text-sm opacity-70 hover:opacity-100 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                @{account.username}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
