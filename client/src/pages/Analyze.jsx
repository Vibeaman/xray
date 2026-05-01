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

    // Clean username (remove @ if present)
    const cleanUsername = username.trim().replace(/^@/, '')

    // Navigate to results page
    navigate(`/results/${cleanUsername}`)
  }

  const popularAccounts = [
    { username: 'elonmusk', label: 'Elon Musk' },
    { username: 'naval', label: 'Naval' },
    { username: 'VitalikButerin', label: 'Vitalik' },
    { username: 'cobie', label: 'Cobie' },
  ]

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-500/20 mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Search className="text-purple-400" size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analyze any <span className="gradient-text">profile</span>
          </h1>
          <p className="text-xl text-gray-400">
            Enter a Twitter/X username to get the full breakdown
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-strong rounded-2xl p-8"
        >
          {/* Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <AtSign className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full input-dark rounded-xl py-4 pl-12 pr-4 text-lg"
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full btn-primary py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2"
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
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-dark-700 text-purple-500" defaultChecked />
              <span className="text-sm">Include Roast</span>
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-dark-700 text-purple-500" defaultChecked />
              <span className="text-sm">Rate PFP</span>
            </label>
          </div>
        </motion.form>

        {/* Popular accounts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm mb-3">Try these popular accounts</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularAccounts.map((account) => (
              <motion.button
                key={account.username}
                onClick={() => setUsername(account.username)}
                className="px-4 py-2 glass rounded-lg text-sm text-gray-400 hover:text-white transition-all"
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
