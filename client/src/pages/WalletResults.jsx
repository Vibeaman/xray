import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Wallet, Coins, Activity, Clock, Image,
  Flame, Share2, Download, ExternalLink, Loader2, 
  AlertCircle, RefreshCw
} from 'lucide-react'
import { API_URL, CHAINS } from '../config'

export default function WalletResults() {
  const { address } = useParams()
  const [searchParams] = useSearchParams()
  const chain = searchParams.get('chain')
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalysis()
  }, [address, chain])

  const fetchAnalysis = async () => {
    setLoading(true)
    setError('')
    
    try {
      const chainParam = chain ? `?chain=${chain}&roast=true` : '?roast=true'
      const response = await fetch(`${API_URL}/api/wallet/${address}${chainParam}`)
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (err) {
      setError('Failed to analyze wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="opacity-70">Scanning wallet...</p>
          <p className="text-sm opacity-50 mt-2 font-mono">{address.slice(0, 8)}...{address.slice(-6)}</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div className="text-center glass-card p-8 max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 font-['Orbitron']">FAILED</h2>
          <p className="opacity-70 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/wallet">
              <motion.button className="btn-outline px-6 py-3 flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                <ArrowLeft size={18} /> Go Back
              </motion.button>
            </Link>
            <motion.button onClick={fetchAnalysis} className="btn-neon px-6 py-3 flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <RefreshCw size={18} /> Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const tierColors = { S: 'tier-s', A: 'tier-a', B: 'tier-b', C: 'tier-c', D: 'tier-d', F: 'tier-f' }
  const chainInfo = CHAINS[data.chain] || { name: data.chain, symbol: '?', color: '#888' }

  return (
    <div className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/wallet">
          <motion.button className="flex items-center gap-2 opacity-70 hover:opacity-100 mb-8 transition-all" whileHover={{ x: -5 }}>
            <ArrowLeft size={20} /> Scan another
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Card */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-6 retro-card">
              {/* Chain & Tier */}
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: `${chainInfo.color}20`, color: chainInfo.color }}>
                  {chainInfo.name}
                </div>
                <div className={`tier-badge ${tierColors[data.tier]}`}>
                  {data.tier}
                </div>
              </div>

              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Wallet size={36} className="text-cyan-400" />
              </div>

              {/* Address */}
              <div className="text-center mb-6">
                <p className="text-xs opacity-50 mb-1">Address</p>
                <a
                  href={`https://solscan.io/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-1"
                >
                  {address.slice(0, 8)}...{address.slice(-8)}
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Balance */}
              <div className="glass-card p-4 text-center mb-6">
                <p className="text-2xl font-bold neon-text font-['Orbitron']">
                  ${data.balance.usd?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm opacity-50">
                  {(data.balance.native || data.balance.sol || 0).toFixed(4)} {chainInfo.symbol}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 text-center">
                  <Activity size={16} className="mx-auto mb-1 text-pink-400" />
                  <div className="text-lg font-bold">{data.transactions?.total || 0}</div>
                  <div className="text-xs opacity-50">Txns</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <Clock size={16} className="mx-auto mb-1 text-cyan-400" />
                  <div className="text-lg font-bold">{data.walletAge?.formatted || 'New'}</div>
                  <div className="text-xs opacity-50">Age</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <Coins size={16} className="mx-auto mb-1 text-purple-400" />
                  <div className="text-lg font-bold">{data.tokens?.count || 0}</div>
                  <div className="text-xs opacity-50">Tokens</div>
                </div>
                <div className="glass-card p-3 text-center">
                  <Image size={16} className="mx-auto mb-1 text-orange-400" />
                  <div className="text-lg font-bold">{data.nfts?.count || 0}</div>
                  <div className="text-xs opacity-50">NFTs</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scores & Roast */}
          <motion.div className="lg:col-span-2 space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {/* Score */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-6 font-['Orbitron'] neon-text">WALLET SCORE</h3>
              
              <div className="flex items-center gap-8">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-10" />
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="url(#walletGrad)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="302"
                      strokeDashoffset={302 - (302 * (data.overallScore || 0)) / 100}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-['Orbitron']">{data.overallScore || 0}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {data.scores && Object.entries(data.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize opacity-70">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
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

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button className="flex-1 btn-outline py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Share2 size={18} /> Share
              </motion.button>
              <motion.button className="flex-1 btn-neon py-3 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                <Download size={18} /> Download
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
