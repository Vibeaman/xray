import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Users, MapPin, BadgeCheck, Flame, Image, 
  Share2, Download, ExternalLink, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { API_URL } from '../config'

export default function Results() {
  const { username } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalysis()
  }, [username])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError('')
    
    try {
      const roast = searchParams.get('roast') !== 'false'
      const pfp = searchParams.get('pfp') !== 'false'
      const response = await fetch(`${API_URL}/api/analyze/${username}?roast=${roast}&pfpRating=${pfp}`)
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (err) {
      setError('Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 opacity-60" />
          <p className="opacity-60">Analyzing @{username}...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6">
        <motion.div className="text-center solid-card p-8 max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-60" />
          <h2 className="text-2xl font-bold font-display mb-2">Failed</h2>
          <p className="opacity-60 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/analyze">
              <button className="btn-secondary px-6 py-3 flex items-center gap-2">
                <ArrowLeft size={18} /> Back
              </button>
            </Link>
            <button onClick={fetchAnalysis} className="btn-primary px-6 py-3 flex items-center gap-2">
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const tierColors = {
    S: 'tier-s', A: 'tier-a', B: 'tier-b', C: 'tier-c', D: 'tier-d', F: 'tier-f'
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to="/analyze">
          <motion.button className="flex items-center gap-2 opacity-60 hover:opacity-100 mb-8" whileHover={{ x: -5 }}>
            <ArrowLeft size={20} /> Back
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="solid-card p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                {data.user.profileImage ? (
                  <img
                    src={data.user.profileImage}
                    alt={data.user.name}
                    className="w-24 h-24 rounded-2xl shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Users size={36} className="opacity-40" />
                  </div>
                )}
                <div className={`absolute -bottom-2 -right-2 tier-badge text-sm ${tierColors[data.tier]}`}>
                  {data.tier}
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{data.user.name}</h2>
                {data.user.verified && <BadgeCheck size={18} className="text-blue-400" />}
              </div>
              <a
                href={`https://x.com/${data.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-60 hover:opacity-100 flex items-center justify-center gap-1"
              >
                @{data.user.username} <ExternalLink size={12} />
              </a>

              {/* Bio */}
              {data.user.description && (
                <p className="text-sm opacity-60 mt-4 leading-relaxed">{data.user.description}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <div className="text-lg font-bold">{data.metrics.followers.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Followers</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <div className="text-lg font-bold">{data.metrics.following.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Following</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <div className="text-lg font-bold">{data.metrics.tweets.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Tweets</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <div className="text-lg font-bold">{data.accountAge.formatted}</div>
                  <div className="text-xs opacity-50">Age</div>
                </div>
              </div>

              {data.user.location && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm opacity-50">
                  <MapPin size={14} /> {data.user.location}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Score */}
            <div className="solid-card p-6">
              <h3 className="font-bold font-display mb-6">Score</h3>
              <div className="flex items-center gap-8">
                {/* Circle */}
                <div className="relative w-24 h-24 score-circle">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" strokeWidth="8" fill="none" className="stroke-current opacity-10" />
                    <circle
                      cx="48" cy="48" r="40"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (251 * data.overallScore) / 100}
                      className="stroke-current transition-all duration-1000"
                      style={{ stroke: '#ff6b6b' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-display">{data.overallScore}</span>
                  </div>
                </div>

                {/* Bars */}
                <div className="flex-1 space-y-3">
                  {Object.entries(data.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize opacity-60">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roast */}
            {data.roast && (
              <motion.div
                className="solid-card p-6 border-l-4 border-orange-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={20} className="text-orange-500" />
                  <h3 className="font-bold font-display">The Roast</h3>
                </div>
                <p className="text-lg leading-relaxed italic opacity-80">"{data.roast}"</p>
              </motion.div>
            )}

            {/* PFP Rating */}
            {data.pfpRating && (
              <motion.div
                className="solid-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Image size={20} className="text-purple-500" />
                  <h3 className="font-bold font-display">PFP Rating</h3>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-bold font-display text-purple-500">{data.pfpRating.rating}/10</div>
                  <div className="flex-1">
                    <p className="opacity-70 mb-1">{data.pfpRating.roast}</p>
                    <p className="text-sm opacity-50">Vibe: {data.pfpRating.vibe}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Share2 size={18} /> Share
              </motion.button>
              <motion.button className="flex-1 btn-primary py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Download size={18} /> Download
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
