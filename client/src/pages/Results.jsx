import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Users, MessageSquare, Calendar, 
  MapPin, BadgeCheck, Flame, Image, Share2, Download,
  ExternalLink, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { API_URL } from '../config'

export default function Results() {
  const { username } = useParams()
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
      const response = await fetch(`${API_URL}/api/analyze/${username}?roast=true&pfpRating=true`)
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (err) {
      setError('Failed to analyze account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="opacity-70">Analyzing @{username}...</p>
          <p className="text-sm opacity-50 mt-2">Preparing the roast 🔥</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          className="text-center glass-card p-8 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 font-['Orbitron']">FAILED</h2>
          <p className="opacity-70 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/analyze">
              <motion.button className="btn-outline px-6 py-3 flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                <ArrowLeft size={18} />
                Go Back
              </motion.button>
            </Link>
            <motion.button onClick={fetchAnalysis} className="btn-neon px-6 py-3 flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <RefreshCw size={18} />
              Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const tierColors = {
    S: 'tier-s',
    A: 'tier-a',
    B: 'tier-b',
    C: 'tier-c',
    D: 'tier-d',
    F: 'tier-f'
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link to="/analyze">
          <motion.button className="flex items-center gap-2 opacity-70 hover:opacity-100 mb-8 transition-all" whileHover={{ x: -5 }}>
            <ArrowLeft size={20} />
            Analyze another
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card p-6 retro-card">
              {/* PFP */}
              <div className="relative mb-6">
                {data.user.profileImage ? (
                  <img
                    src={data.user.profileImage}
                    alt={data.user.name}
                    className="w-28 h-28 rounded-2xl mx-auto ring-4 ring-pink-500/50"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl mx-auto bg-purple-500/20 flex items-center justify-center">
                    <Users size={40} className="text-purple-400" />
                  </div>
                )}
                
                {/* Tier Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 tier-badge ${tierColors[data.tier]}`}>
                  {data.tier}
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold">{data.user.name}</h2>
                  {data.user.verified && <BadgeCheck className="text-cyan-400" size={20} />}
                </div>
                <a
                  href={`https://x.com/${data.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-1 text-sm"
                >
                  @{data.user.username}
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Bio */}
              {data.user.description && (
                <p className="text-sm opacity-70 text-center mb-6">{data.user.description}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 text-center">
                  <div className="text-xl font-bold text-cyan-400">{data.metrics.followers.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Followers</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-xl font-bold text-pink-400">{data.metrics.following.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Following</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-xl font-bold">{data.metrics.tweets.toLocaleString()}</div>
                  <div className="text-xs opacity-50">Tweets</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <div className="text-xl font-bold text-purple-400">{data.accountAge.formatted}</div>
                  <div className="text-xs opacity-50">Age</div>
                </div>
              </div>

              {data.user.location && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm opacity-70">
                  <MapPin size={14} />
                  {data.user.location}
                </div>
              )}
            </div>
          </motion.div>

          {/* Scores & Roast */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Overall Score */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-6 font-['Orbitron'] neon-text">SCORE</h3>
              
              <div className="flex items-center gap-8">
                {/* Circle */}
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-10" />
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="url(#scoreGrad)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="302"
                      strokeDashoffset={302 - (302 * data.overallScore) / 100}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-['Orbitron']">{data.overallScore}</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-3">
                  {Object.entries(data.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize opacity-70">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 font-['Orbitron']">ENGAGEMENT</h3>
              {data.engagement.isEstimated && (
                <p className="text-xs opacity-50 mb-4">* Estimated from profile metrics</p>
              )}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-pink-400">{data.engagement.rate}%</div>
                  <div className="text-xs opacity-50">Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.engagement.avgLikes}</div>
                  <div className="text-xs opacity-50">Avg Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.engagement.avgRetweets}</div>
                  <div className="text-xs opacity-50">Avg RTs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{data.engagement.avgReplies}</div>
                  <div className="text-xs opacity-50">Avg Replies</div>
                </div>
              </div>
            </div>

            {/* Roast */}
            {data.roast && (
              <motion.div
                className="glass-card p-6 border-2 border-orange-500/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="text-orange-500" size={24} />
                  <h3 className="text-lg font-semibold font-['Orbitron'] text-orange-400">THE ROAST</h3>
                </div>
                <p className="text-lg leading-relaxed italic opacity-90">"{data.roast}"</p>
              </motion.div>
            )}

            {/* PFP Rating */}
            {data.pfpRating && (
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Image className="text-cyan-400" size={24} />
                  <h3 className="text-lg font-semibold font-['Orbitron']">PFP RATING</h3>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold neon-text font-['Orbitron']">{data.pfpRating.rating}/10</div>
                  </div>
                  <div className="flex-1">
                    <p className="opacity-80 mb-2">{data.pfpRating.roast}</p>
                    <p className="text-sm opacity-60">
                      <span className="text-purple-400">Vibe:</span> {data.pfpRating.vibe}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button className="flex-1 btn-outline py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Share2 size={18} />
                Share
              </motion.button>
              <motion.button className="flex-1 btn-neon py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Download size={18} />
                Download
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
