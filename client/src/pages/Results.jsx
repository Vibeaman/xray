import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, BadgeCheck, Flame, 
  Share2, Download, ExternalLink, Loader2, AlertCircle, RefreshCw, X
} from 'lucide-react'
import { API_URL } from '../config'
import html2canvas from 'html2canvas'

export default function Results() {
  const { username } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef(null)

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

  const downloadCard = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ff7b5f',
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('[data-card]')
          if (clonedCard) {
            clonedCard.style.transform = 'none'
          }
        }
      })
      
      const link = document.createElement('a')
      link.download = `cloutcheck-${data.user.username}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed. Try taking a screenshot instead!')
    } finally {
      setDownloading(false)
    }
  }

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CloutCheck - @${data.user.username}`,
          text: `Check out @${data.user.username}'s CloutCheck score!`,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
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
    S: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    A: 'bg-gradient-to-r from-purple-500 to-violet-600',
    B: 'bg-gradient-to-r from-blue-500 to-blue-600',
    C: 'bg-gradient-to-r from-green-500 to-emerald-600',
    D: 'bg-gradient-to-r from-orange-500 to-orange-600',
    F: 'bg-gradient-to-r from-red-500 to-red-600'
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Back Button */}
      <div className="w-full max-w-md mb-6">
        <Link to="/analyze">
          <motion.button className="flex items-center gap-2 opacity-60 hover:opacity-100" whileHover={{ x: -5 }}>
            <ArrowLeft size={20} /> Back
          </motion.button>
        </Link>
      </div>

      {/* ID Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-4 rounded-3xl"
        style={{ backgroundColor: 'transparent' }}
      >
        <div data-card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Section - Profile */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-50 dark:to-gray-100 pt-6 pb-4 px-6 text-center">
            {/* Avatar with Tier Badge */}
            <div className="relative inline-block mb-3">
              {data.user.profileImage ? (
                <img
                  src={data.user.profileImage}
                  alt={data.user.name}
                  className="w-20 h-20 rounded-2xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                  {data.user.name?.charAt(0) || '?'}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-lg ${tierColors[data.tier]} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                {data.tier}
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-bold text-gray-800">{data.user.name}</h1>
              {data.user.verified && <BadgeCheck size={18} className="text-blue-500" />}
            </div>
            
            {/* Handle */}
            <a
              href={`https://x.com/${data.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              @{data.user.username} <ExternalLink size={12} />
            </a>
          </div>

          {/* Clout Score Section */}
          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-sm">Clout Score</h2>
              <span className="text-[10px] text-gray-400">estimated from public metrics</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Score Circle */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90">
                  <circle cx="32" cy="32" r="26" strokeWidth="5" fill="none" stroke="#f3f4f6" />
                  <circle
                    cx="32" cy="32" r="26"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="163.4"
                    strokeDashoffset={163.4 - (163.4 * data.overallScore) / 100}
                    stroke="#ff6b6b"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{data.overallScore}</span>
                </div>
              </div>

              {/* Score Bars */}
              <div className="flex-1 space-y-1.5">
                {Object.entries(data.scores).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize w-16">{key}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verdict Section */}
          {data.roast && (
            <div className="px-5 pb-4">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Flame size={14} className="text-orange-500" />
                  <span className="font-bold text-gray-800 text-sm">The Verdict</span>
                </div>
                <p className="text-gray-700 text-sm leading-snug">{data.roast}</p>
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className="px-5 pb-3 flex items-center justify-between text-[10px] text-gray-400">
            <span className="font-semibold">CloutCheck</span>
            <span>cloutcheck.app</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="w-full max-w-md mt-6 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={shareCard}
          className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
        >
          <Share2 size={18} /> Share
        </button>
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          Download
        </button>
      </motion.div>

      {/* Analyze Another */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link to="/analyze" className="text-sm opacity-50 hover:opacity-80 transition-opacity">
          Analyze another profile →
        </Link>
      </motion.div>
    </div>
  )
}
