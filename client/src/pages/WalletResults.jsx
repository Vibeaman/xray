import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Wallet, Coins, Activity, Clock, Image,
  Flame, Share2, Download, ExternalLink, Loader2, AlertCircle, RefreshCw
} from 'lucide-react'
import { API_URL, CHAINS } from '../config'

export default function WalletResults() {
  const { address } = useParams()
  const [searchParams] = useSearchParams()
  const chain = searchParams.get('chain')
  const includeRoast = searchParams.get('roast') !== 'false'
  
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
      const chainParam = chain ? `?chain=${chain}&roast=${includeRoast}` : `?roast=${includeRoast}`
      const response = await fetch(`${API_URL}/api/wallet/${address}${chainParam}`)
      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result)
      }
    } catch (err) {
      setError('Failed to scan wallet.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 opacity-60" />
          <p className="opacity-60">Scanning wallet...</p>
          <p className="text-sm opacity-40 mt-1 font-mono">{address.slice(0, 8)}...{address.slice(-6)}</p>
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
            <Link to="/wallet">
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

  const tierColors = { S: 'tier-s', A: 'tier-a', B: 'tier-b', C: 'tier-c', D: 'tier-d', F: 'tier-f' }
  const chainInfo = CHAINS[data.chain] || { name: data.chain, symbol: '?', color: '#888' }

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to="/wallet">
          <motion.button className="flex items-center gap-2 opacity-60 hover:opacity-100 mb-8" whileHover={{ x: -5 }}>
            <ArrowLeft size={20} /> Back
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="solid-card p-6 text-center">
              {/* Chain & Tier */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${chainInfo.color}20`, color: chainInfo.color }}
                >
                  {chainInfo.name}
                </div>
                <div className={`tier-badge text-sm ${tierColors[data.tier]}`}>
                  {data.tier}
                </div>
              </div>

              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-400/20 flex items-center justify-center mx-auto mb-4">
                <Wallet size={36} className="opacity-70" />
              </div>

              {/* Address */}
              <p className="text-xs opacity-40 mb-1">Address</p>
              <a
                href={`https://solscan.io/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm opacity-70 hover:opacity-100 flex items-center justify-center gap-1"
              >
                {address.slice(0, 8)}...{address.slice(-8)}
                <ExternalLink size={12} />
              </a>

              {/* Balance */}
              <div className="bg-white/10 dark:bg-white/5 rounded-xl p-4 mt-6">
                <p className="text-2xl font-bold font-display">
                  ${data.balance.usd?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm opacity-50">
                  {(data.balance.native || data.balance.sol || 0).toFixed(4)} {chainInfo.symbol}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <Activity size={16} className="mx-auto mb-1 opacity-60" />
                  <div className="text-lg font-bold">{data.transactions?.total || 0}</div>
                  <div className="text-xs opacity-40">Txns</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <Clock size={16} className="mx-auto mb-1 opacity-60" />
                  <div className="text-lg font-bold">{data.walletAge?.formatted || 'New'}</div>
                  <div className="text-xs opacity-40">Age</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <Coins size={16} className="mx-auto mb-1 opacity-60" />
                  <div className="text-lg font-bold">{data.tokens?.count || 0}</div>
                  <div className="text-xs opacity-40">Tokens</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 rounded-xl p-3">
                  <Image size={16} className="mx-auto mb-1 opacity-60" />
                  <div className="text-lg font-bold">{data.nfts?.count || 0}</div>
                  <div className="text-xs opacity-40">NFTs</div>
                </div>
              </div>
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
              <h3 className="font-bold font-display mb-6">Wallet Score</h3>
              <div className="flex items-center gap-8">
                <div className="relative w-24 h-24 score-circle">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" strokeWidth="8" fill="none" className="stroke-current opacity-10" />
                    <circle
                      cx="48" cy="48" r="40"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (251 * (data.overallScore || 0)) / 100}
                      className="stroke-current transition-all duration-1000"
                      style={{ stroke: '#ff6b6b' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-display">{data.overallScore || 0}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {data.scores && Object.entries(data.scores).map(([key, value]) => (
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
