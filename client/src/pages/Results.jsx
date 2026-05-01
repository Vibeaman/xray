import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Users, UserPlus, MessageSquare, Calendar, 
  MapPin, BadgeCheck, Flame, Image, Share2, Download,
  ExternalLink, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { API_URL, TIER_COLORS } from '../config'

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing @{username}...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing the roast 🔥</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center glass-strong rounded-2xl p-8 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Analysis Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/analyze">
              <motion.button
                className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={18} />
                Go Back
              </motion.button>
            </Link>
            <motion.button
              onClick={fetchAnalysis}
              className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <RefreshCw size={18} />
              Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const tierStyle = TIER_COLORS[data.tier] || TIER_COLORS.F

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link to="/analyze">
          <motion.button
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={20} />
            Analyze another
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Profile Card */}
            <div className="glass-strong rounded-2xl p-6 card-3d">
              {/* PFP */}
              <div className="relative mb-6">
                {data.user.profileImage ? (
                  <img
                    src={data.user.profileImage}
                    alt={data.user.name}
                    className="w-32 h-32 rounded-2xl mx-auto ring-4 ring-purple-500/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl mx-auto bg-dark-600 flex items-center justify-center">
                    <Users size={48} className="text-gray-600" />
                  </div>
                )}
                
                {/* Tier Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r ${tierStyle.bg} ${tierStyle.text} font-bold text-lg shadow-lg ${tierStyle.glow}`}>
                  {data.tier}
                </div>
              </div>

              {/* Name & Username */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold">{data.user.name}</h2>
                  {data.user.verified && (
                    <BadgeCheck className="text-blue-400" size={24} />
                  )}
                </div>
                <a
                  href={`https://x.com/${data.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center gap-1"
                >
                  @{data.user.username}
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Bio */}
              {data.user.description && (
                <p className="text-gray-400 text-center text-sm mb-6">
                  {data.user.description}
                </p>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{data.metrics.followers.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{data.metrics.following.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{data.metrics.tweets.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Tweets</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{data.accountAge.formatted}</div>
                  <div className="text-xs text-gray-500">Account Age</div>
                </div>
              </div>

              {/* Location */}
              {data.user.location && (
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <MapPin size={14} />
                  {data.user.location}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Scores & Roast */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Overall Score */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6">Overall Score</h3>
              
              <div className="flex items-center gap-8">
                {/* Score Circle */}
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-dark-600"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="352"
                      strokeDashoffset={352 - (352 * data.overallScore) / 100}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{data.overallScore}</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="flex-1 space-y-3">
                  {Object.entries(data.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
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
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Engagement</h3>
              {data.engagement.isEstimated && (
                <p className="text-xs text-gray-500 mb-4">* Estimated based on profile metrics</p>
              )}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{data.engagement.rate}%</div>
                  <div className="text-xs text-gray-500">Engagement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.avgLikes}</div>
                  <div className="text-xs text-gray-500">Avg Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.avgRetweets}</div>
                  <div className="text-xs text-gray-500">Avg Retweets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.engagement.avgReplies}</div>
                  <div className="text-xs text-gray-500">Avg Replies</div>
                </div>
              </div>
            </div>

            {/* Roast */}
            {data.roast && (
              <motion.div
                className="glass-strong rounded-2xl p-6 border border-orange-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="text-orange-500" size={24} />
                  <h3 className="text-xl font-semibold gradient-text-fire">The Roast</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed italic">
                  "{data.roast}"
                </p>
              </motion.div>
            )}

            {/* PFP Rating */}
            {data.pfpRating && (
              <motion.div
                className="glass-strong rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Image className="text-cyan-400" size={24} />
                  <h3 className="text-xl font-semibold">PFP Rating</h3>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">{data.pfpRating.rating}/10</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 mb-2">{data.pfpRating.roast}</p>
                    <p className="text-sm text-gray-500">
                      <span className="text-purple-400">Vibe:</span> {data.pfpRating.vibe}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button
                className="flex-1 btn-secondary py-3 rounded-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <Share2 size={18} />
                Share Results
              </motion.button>
              <motion.button
                className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <Download size={18} />
                Download Card
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
