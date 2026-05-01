import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, AtSign, Loader2, Flame, Image } from 'lucide-react'

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [includeRoast, setIncludeRoast] = useState(true)
  const [ratePfp, setRatePfp] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) return

    const cleanUsername = username.trim().replace(/^@/, '')
    navigate(`/results/${cleanUsername}?roast=${includeRoast}&pfp=${ratePfp}`)
  }

  const suggestions = ['elonmusk', 'naval', 'VitalikButerin', 'cobie']

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
            whileHover={{ rotate: 10 }}
          >
            <Search size={36} className="opacity-80" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            Analyze
          </h1>
          <p className="text-lg opacity-60">
            Enter a Twitter/X username
          </p>
        </div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="solid-card p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 z-10 pointer-events-none">
              <AtSign size={20} className="opacity-40" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="input-field text-lg"
              style={{ paddingLeft: '52px' }}
              disabled={loading}
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 mb-6">
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
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={ratePfp}
                onChange={(e) => setRatePfp(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-current text-purple-500 focus:ring-purple-500"
              />
              <span className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <Image size={18} className="text-purple-500" />
                Rate PFP
              </span>
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !username.trim()}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <Search size={22} />
                Analyze
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm opacity-40 mb-3">Try these</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((name) => (
              <motion.button
                key={name}
                onClick={() => setUsername(name)}
                className="px-4 py-2 rounded-lg bg-white/10 dark:bg-white/10 text-sm hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                @{name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
