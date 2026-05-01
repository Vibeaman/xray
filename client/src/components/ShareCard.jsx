import { forwardRef } from 'react'
import { BadgeCheck, ExternalLink } from 'lucide-react'

const ShareCard = forwardRef(({ data }, ref) => {
  const tierColors = {
    S: 'from-yellow-400 to-amber-500',
    A: 'from-purple-500 to-violet-600',
    B: 'from-blue-500 to-blue-600',
    C: 'from-green-500 to-emerald-600',
    D: 'from-orange-500 to-orange-600',
    F: 'from-red-500 to-red-600'
  }

  const tierBg = {
    S: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    A: 'bg-gradient-to-r from-purple-500 to-violet-600',
    B: 'bg-gradient-to-r from-blue-500 to-blue-600',
    C: 'bg-gradient-to-r from-green-500 to-emerald-600',
    D: 'bg-gradient-to-r from-orange-500 to-orange-600',
    F: 'bg-gradient-to-r from-red-500 to-red-600'
  }

  return (
    <div 
      ref={ref}
      className="w-[400px] bg-gradient-to-br from-[#ff6b6b] via-[#ff8e53] to-[#ffb347] p-5 rounded-2xl shadow-2xl"
      style={{ fontFamily: "'Poppins', sans-serif", minHeight: 'auto' }}
    >
      {/* Header with PFP and Info */}
      <div className="flex items-center gap-4 mb-4">
        {/* PFP with Tier Badge */}
        <div className="relative">
          {data.user.profileImage ? (
            <img
              src={data.user.profileImage}
              alt={data.user.name}
              className="w-16 h-16 rounded-xl shadow-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
              {data.user.name?.charAt(0) || '?'}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-lg ${tierBg[data.tier]} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
            {data.tier}
          </div>
        </div>

        {/* Name and Handle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-lg truncate">{data.user.name}</span>
            {data.user.verified && <BadgeCheck size={16} className="text-blue-300 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <span>@{data.user.username}</span>
            <ExternalLink size={10} />
          </div>
        </div>

        {/* Score Circle */}
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90">
            <circle cx="28" cy="28" r="24" strokeWidth="4" fill="none" stroke="rgba(255,255,255,0.2)" />
            <circle
              cx="28" cy="28" r="24"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="150.8"
              strokeDashoffset={150.8 - (150.8 * data.overallScore) / 100}
              stroke="white"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{data.overallScore}</span>
          </div>
        </div>
      </div>

      {/* Verdict Card */}
      <div className="bg-white/95 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-gray-800 text-sm">The Verdict</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {data.roast || 'No verdict available'}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">CloutCheck</span>
          <span className="text-white/60 text-xs">• cloutcheck.app</span>
        </div>
        <div className="text-white/50 text-xs">
          Are they building or chasing clout?
        </div>
      </div>
    </div>
  )
})

ShareCard.displayName = 'ShareCard'

export default ShareCard
