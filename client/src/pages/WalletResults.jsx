import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Wallet, Coins, Activity, Clock, Image,
  Flame, Share2, Download, ExternalLink, Loader2, 
  AlertCircle, RefreshCw, TrendingUp
} from 'lucide-react'
import { API_URL, TIER_COLORS, CHAINS } from '../config'

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Scanning wallet...</p>
          <p className="text-gray-500 text-sm mt-2 font-mono">{address.slice(0, 8)}...{address.slice(-6)}</p>
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
          <h2 className="text-2xl font-bold mb-2">Scan Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/wallet">
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
  const chainInfo = CHAINS[data.chain] || { name: data.chain, symbol: '?', color: '#888' }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link to="/wallet">
          <motion.button
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft size={20} />
            Scan another wallet
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-strong rounded-2xl p-6 card-3d">
              {/* Chain Badge */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${chainInfo.color}20`, color: chainInfo.color }}
                >
                  {chainInfo.name}
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${tierStyle.bg} ${tierStyle.text} font-bold text-sm`}>
                  Tier {data.tier}
                </div>
              </div>

              {/* Wallet Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Wallet size={40} className="text-blue-400" />
              </div>

              {/* Address */}
              <div className="text-center mb-6">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <a
                  href={`https://solscan.io/account/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-gray-300 hover:text-purple-400 transition-all flex items-center justify-center gap-1"
                >
                  {address.slice(0, 8)}...{address.slice(-8)}
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Balance */}
              <div className="glass rounded-xl p-4 text-center mb-6">
                <p className="text-3xl font-bold gradient-text">
                  ${data.balance.usd?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-500">
                  {(data.balance.native || data.balance.sol || 0).toFixed(4)} {chainInfo.symbol}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-3 text-center">
                  <Activity size={18} className="mx-auto mb-1 text-purple-400" />
                  <div className="text-lg font-bold">{data.transactions?.total || 0}</div>
                  <div className="text-xs text-gray-500">Transactions</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <Clock size={18} className="mx-auto mb-1 text-blue-400" />
                  <div className="text-lg font-bold">{data.walletAge?.formatted || 'New'}</div>
                  <div className="text-xs text-gray-500">Wallet Age</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <Coins size={18} className="mx-auto mb-1 text-green-400" />
                  <div className="text-lg font-bold">{data.tokens?.count || 0}</div>
                  <div className="text-xs text-gray-500">Tokens</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <Image size={18} className="mx-auto mb-1 text-pink-400" />
                  <div className="text-lg font-bold">{data.nfts?.count || 0}</div>
                  <div className="text-xs text-gray-500">NFTs</div>
                </div>
              </div>
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
              <h3 className="text-xl font-semibold mb-6">Wallet Score</h3>
              
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
                      stroke="url(#walletGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="352"
                      strokeDashoffset={352 - (352 * (data.overallScore || 0)) / 100}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{data.overallScore || 0}</span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="flex-1 space-y-3">
                  {data.scores && Object.entries(data.scores).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
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

            {/* Token Holdings */}
            {data.tokens?.holdings?.length > 0 && (
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Token Holdings</h3>
                <div className="space-y-2">
                  {data.tokens.holdings.slice(0, 5).map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <Coins size={16} className="text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {token.mint?.slice(0, 8) || token.contract?.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.amount?.toFixed(2) || '0'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
