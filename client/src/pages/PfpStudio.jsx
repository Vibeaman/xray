import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Upload, Download, RefreshCw, Wand2 } from 'lucide-react'
import { API_URL } from '../config'

export default function PfpStudio() {
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
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const generateLore = async () => {
    if (!imageUrl) return
    setLoreLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/pfp/lore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'A profile picture character' })
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

  return (
    <div className="px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-6 shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles size={36} className="opacity-80" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            PFP Studio
          </h1>
          <p className="text-lg opacity-60">
            Transform your profile picture
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="solid-card p-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 dark:from-white/5 dark:to-white/10 flex items-center justify-center relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ filter: getActiveFilter() }}
                  />
                ) : (
                  <div className="text-center opacity-40">
                    <Upload size={48} className="mx-auto mb-4" />
                    <p>Upload image</p>
                  </div>
                )}

                {selectedSeason && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: seasons.find(s => s.id === selectedSeason)?.overlay || 'transparent' }}
                  />
                )}
              </div>

              {/* Upload */}
              <div className="mt-4 space-y-3">
                <label className="block">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="btn-secondary py-3 text-center cursor-pointer flex items-center justify-center gap-2">
                    <Upload size={18} /> Upload
                  </div>
                </label>
                <input
                  type="text"
                  placeholder="Or paste URL..."
                  value={imageUrl.startsWith('blob:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Lore */}
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="solid-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-display flex items-center gap-2">
                    <Wand2 size={18} className="text-purple-500" /> Lore
                  </h3>
                  <motion.button
                    onClick={generateLore}
                    disabled={loreLoading}
                    className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loreLoading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    Generate
                  </motion.button>
                </div>
                {lore ? (
                  <p className="italic opacity-70">"{lore}"</p>
                ) : (
                  <p className="text-sm opacity-40">Generate AI lore for your character</p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Styles */}
            <div className="solid-card p-6">
              <h3 className="font-bold font-display mb-4">Styles</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setSelectedStyle(null); setSelectedSeason(null); }}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    !selectedStyle && !selectedSeason
                      ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                      : 'bg-white/10 hover:bg-white/20'
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
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div className="solid-card p-6">
              <h3 className="font-bold font-display mb-4">Seasonal</h3>
              <div className="grid grid-cols-3 gap-3">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => { setSelectedSeason(season.id); setSelectedStyle(null); }}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      selectedSeason === season.id
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-sm">{season.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download */}
            {imageUrl && (
              <motion.button
                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} /> Download
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
