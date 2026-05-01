import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Upload, Download, RefreshCw, Wand2,
  Sun, Snowflake, Leaf, Flower2, Ghost, Gift
} from 'lucide-react'
import { API_URL } from '../config'

export default function PfpStudio() {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [lore, setLore] = useState('')
  const [loreLoading, setLoreLoading] = useState(false)
  const [styles, setStyles] = useState([])
  const [seasons, setSeasons] = useState([])

  useEffect(() => {
    fetchStyles()
    fetchSeasons()
  }, [])

  const fetchStyles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pfp/styles`)
      const data = await response.json()
      setStyles(data.styles || [])
    } catch (error) {
      console.error('Failed to fetch styles:', error)
    }
  }

  const fetchSeasons = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pfp/seasons`)
      const data = await response.json()
      setSeasons(data.seasons || [])
    } catch (error) {
      console.error('Failed to fetch seasons:', error)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setImage(file)
    }
  }

  const handleUrlInput = (e) => {
    setImageUrl(e.target.value)
    setImage(null)
  }

  const generateLore = async () => {
    if (!imageUrl) return
    
    setLoreLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/pfp/lore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'A profile picture' })
      })
      const data = await response.json()
      setLore(data.lore)
    } catch (error) {
      console.error('Failed to generate lore:', error)
    } finally {
      setLoreLoading(false)
    }
  }

  const getActiveFilter = () => {
    if (selectedStyle) {
      const style = styles.find(s => s.id === selectedStyle)
      return style?.filter || 'none'
    }
    if (selectedSeason) {
      const season = seasons.find(s => s.id === selectedSeason)
      return season?.filter || 'none'
    }
    return 'none'
  }

  const seasonIcons = {
    winter: Snowflake,
    spring: Flower2,
    summer: Sun,
    fall: Leaf,
    halloween: Ghost,
    christmas: Gift
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-500/20 mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="text-cyan-400" size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">PFP</span> Studio
          </h1>
          <p className="text-xl text-gray-400">
            Transform your profile picture with filters, themes, and AI-generated lore
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-dark-700 flex items-center justify-center relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ filter: getActiveFilter() }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload size={48} className="mx-auto mb-4" />
                    <p>Upload or paste image URL</p>
                  </div>
                )}
                
                {/* Season overlay */}
                {selectedSeason && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      backgroundColor: seasons.find(s => s.id === selectedSeason)?.overlay || 'transparent'
                    }}
                  />
                )}
              </div>

              {/* Upload Controls */}
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="btn-secondary py-3 rounded-xl text-center cursor-pointer flex items-center justify-center gap-2">
                      <Upload size={18} />
                      Upload Image
                    </div>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={image ? '' : imageUrl}
                  onChange={handleUrlInput}
                  className="w-full input-dark rounded-xl py-3 px-4 text-sm"
                />
              </div>
            </div>

            {/* Lore Generator */}
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Wand2 className="text-purple-400" size={20} />
                    Character Lore
                  </h3>
                  <motion.button
                    onClick={generateLore}
                    disabled={loreLoading}
                    className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loreLoading ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    Generate
                  </motion.button>
                </div>
                {lore ? (
                  <p className="text-gray-300 italic leading-relaxed">"{lore}"</p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Click generate to create AI-powered lore for your character
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right - Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Style Filters */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Style Filters</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setSelectedStyle(null); setSelectedSeason(null); }}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    !selectedStyle && !selectedSeason
                      ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  None
                </button>
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => { setSelectedStyle(style.id); setSelectedSeason(null); }}
                    className={`p-3 rounded-xl text-sm transition-all ${
                      selectedStyle === style.id
                        ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500'
                        : 'glass hover:bg-white/5'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasonal Themes */}
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Seasonal Themes</h3>
              <div className="grid grid-cols-3 gap-3">
                {seasons.map((season) => {
                  const Icon = seasonIcons[season.id] || Sparkles
                  return (
                    <button
                      key={season.id}
                      onClick={() => { setSelectedSeason(season.id); setSelectedStyle(null); }}
                      className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        selectedSeason === season.id
                          ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500'
                          : 'glass hover:bg-white/5'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-sm">{season.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Download */}
            {imageUrl && (
              <motion.button
                className="w-full btn-primary py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} />
                Download PFP
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
