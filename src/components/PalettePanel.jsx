import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Plus, Download, Upload, Star, Trash2, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PalettePanel = () => {
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('library')
  const [newPaletteName, setNewPaletteName] = useState('')

  // Mock palette data
  const [palettes, setPalettes] = useState([
    {
      id: 1,
      name: 'Fire & Flame',
      colors: ['#FF4500', '#FF6347', '#FFD700', '#FF8C00', '#DC143C'],
      favorite: true,
      category: 'Fire'
    },
    {
      id: 2,
      name: 'Ice Crystal',
      colors: ['#00BFFF', '#87CEEB', '#E0FFFF', '#B0E0E6', '#4682B4'],
      favorite: false,
      category: 'Ice'
    },
    {
      id: 3,
      name: 'Magic Purple',
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF'],
      favorite: true,
      category: 'Magic'
    },
    {
      id: 4,
      name: 'Nature Green',
      colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
      favorite: false,
      category: 'Nature'
    }
  ])

  const [colorThemes] = useState([
    { name: 'Fire', colors: ['#FF4500', '#FF6347', '#FFD700'] },
    { name: 'Ice', colors: ['#00BFFF', '#87CEEB', '#E0FFFF'] },
    { name: 'Magic', colors: ['#8B5CF6', '#A855F7', '#C084FC'] },
    { name: 'Neon', colors: ['#FF0080', '#00FF80', '#8000FF'] },
    { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFD23F'] },
    { name: 'Ocean', colors: ['#006A6B', '#0582CA', '#00A8CC'] }
  ])

  const toggleFavorite = (paletteId) => {
    setPalettes(palettes.map(p => 
      p.id === paletteId ? { ...p, favorite: !p.favorite } : p
    ))
  }

  const deletePalette = (paletteId) => {
    setPalettes(palettes.filter(p => p.id !== paletteId))
  }

  const applyPalette = (palette) => {
    console.log('Applying palette:', palette.name)
    // Palette application logic would go here
  }

  const createNewPalette = () => {
    if (!newPaletteName.trim()) return
    
    const newPalette = {
      id: Date.now(),
      name: newPaletteName,
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE', '#E9D5FF'],
      favorite: false,
      category: 'Custom'
    }
    
    setPalettes([newPalette, ...palettes])
    setNewPaletteName('')
  }

  const exportPalettes = () => {
    const dataStr = JSON.stringify(palettes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'divinesaw-palettes.json'
    link.click()
  }

  const importPalettes = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedPalettes = JSON.parse(e.target.result)
        setPalettes([...palettes, ...importedPalettes])
      } catch (error) {
        console.error('Error importing palettes:', error)
      }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: 'library', label: 'Library', icon: Palette },
    { id: 'themes', label: 'Themes', icon: Star }
  ]

  return (
    <div className="glass rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-purple-400" />
          <span>Color Palettes</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportPalettes}
            className="p-1 text-gray-400 hover:text-white"
            title="Export Palettes"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="p-1 text-gray-400 hover:text-white cursor-pointer" title="Import Palettes">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={importPalettes}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-colors relative
                ${activeTab === tab.id 
                  ? 'text-purple-400 bg-purple-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Create New Palette */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New palette name..."
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createNewPalette()}
                    className="flex-1 px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={createNewPalette}
                    disabled={!newPaletteName.trim()}
                    className="px-3 py-2 gradient-purple text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Palette List */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {palettes.map((palette) => (
                  <motion.div
                    key={palette.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{palette.name}</h4>
                        <p className="text-xs text-gray-400">{palette.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(palette.id)}
                          className={`p-1 ${palette.favorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                        >
                          <Star className={`w-4 h-4 ${palette.favorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => deletePalette(palette.id)}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex gap-1 mb-3">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-8 rounded border border-gray-600 cursor-pointer hover-lift"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => applyPalette(palette)}
                        className="flex-1 py-2 bg-purple-500/20 text-purple-300 rounded text-sm hover:bg-purple-500/30 transition-colors"
                      >
                        Apply
                      </button>
                      <button className="px-3 py-2 bg-black/30 text-gray-400 rounded text-sm hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-auto p-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((theme, index) => (
                  <motion.div
                    key={theme.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer hover-lift"
                    onClick={() => console.log('Apply theme:', theme.name)}
                  >
                    <h4 className="font-medium text-white mb-2 text-center">{theme.name}</h4>
                    <div className="flex gap-1">
                      {theme.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PalettePanel