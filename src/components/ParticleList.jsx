import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronRight, Zap, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ParticleList = () => {
  const { state, setSelectedEmitters } = useApp()
  const [expandedParticles, setExpandedParticles] = useState(new Set())
  const [localSearch, setLocalSearch] = useState('')

  // Mock particle data for demonstration
  const mockParticles = [
    {
      id: 1,
      name: 'Fire_Burst_System',
      emitters: [
        { id: 11, name: 'Fire_Core', type: 'Complex', colors: { oc: '#FF4500', rc: '#FF6347', lc: '#FFD700', bc: '#FF8C00', main: '#FF4500' } },
        { id: 12, name: 'Fire_Sparks', type: 'Simple', colors: { oc: '#FF6347', rc: '#FF4500', lc: '#FFA500', bc: '#FF7F50', main: '#FF6347' } },
        { id: 13, name: 'Smoke_Trail', type: 'Complex', colors: { oc: '#696969', rc: '#808080', lc: '#A9A9A9', bc: '#D3D3D3', main: '#696969' } }
      ]
    },
    {
      id: 2,
      name: 'Ice_Crystal_System',
      emitters: [
        { id: 21, name: 'Ice_Core', type: 'Complex', colors: { oc: '#00BFFF', rc: '#87CEEB', lc: '#E0FFFF', bc: '#B0E0E6', main: '#00BFFF' } },
        { id: 22, name: 'Frost_Particles', type: 'Simple', colors: { oc: '#87CEEB', rc: '#00BFFF', lc: '#F0F8FF', bc: '#E6F3FF', main: '#87CEEB' } }
      ]
    },
    {
      id: 3,
      name: 'Magic_Aura_System',
      emitters: [
        { id: 31, name: 'Aura_Ring', type: 'Complex', colors: { oc: '#8B5CF6', rc: '#A855F7', lc: '#C084FC', bc: '#D8B4FE', main: '#8B5CF6' } },
        { id: 32, name: 'Magic_Sparkles', type: 'Simple', colors: { oc: '#A855F7', rc: '#8B5CF6', lc: '#DDD6FE', bc: '#EDE9FE', main: '#A855F7' } },
        { id: 33, name: 'Energy_Wisps', type: 'Complex', colors: { oc: '#C084FC', rc: '#A855F7', lc: '#F3E8FF', bc: '#FAF5FF', main: '#C084FC' } }
      ]
    }
  ]

  const filteredParticles = useMemo(() => {
    const query = (localSearch || state.searchQuery).toLowerCase()
    if (!query) return mockParticles

    return mockParticles.filter(particle => 
      particle.name.toLowerCase().includes(query) ||
      particle.emitters.some(emitter => emitter.name.toLowerCase().includes(query))
    )
  }, [localSearch, state.searchQuery])

  const toggleParticleExpansion = (particleId) => {
    const newExpanded = new Set(expandedParticles)
    if (newExpanded.has(particleId)) {
      newExpanded.delete(particleId)
    } else {
      newExpanded.add(particleId)
    }
    setExpandedParticles(newExpanded)
  }

  const toggleEmitterSelection = (emitter) => {
    const isSelected = state.selectedEmitters.some(e => e.id === emitter.id)
    if (isSelected) {
      setSelectedEmitters(state.selectedEmitters.filter(e => e.id !== emitter.id))
    } else {
      setSelectedEmitters([...state.selectedEmitters, emitter])
    }
  }

  const selectAllEmitters = () => {
    const allEmitters = filteredParticles.flatMap(p => p.emitters)
    setSelectedEmitters(allEmitters)
  }

  const clearSelection = () => {
    setSelectedEmitters([])
  }

  return (
    <div className="glass rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>Particle Systems</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {state.selectedEmitters.length} selected
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search particles and emitters..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Selection Controls */}
      <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={selectAllEmitters}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Select All
          </button>
          <span className="text-gray-600">•</span>
          <button
            onClick={clearSelection}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        <div className="text-xs text-gray-400">
          {filteredParticles.reduce((acc, p) => acc + p.emitters.length, 0)} emitters
        </div>
      </div>

      {/* Particle List */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence>
          {filteredParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-b border-gray-800 last:border-b-0"
            >
              {/* Particle Header */}
              <div
                className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3"
                onClick={() => toggleParticleExpansion(particle.id)}
              >
                <button className="text-gray-400 hover:text-white">
                  {expandedParticles.has(particle.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{particle.name}</h3>
                  <p className="text-xs text-gray-400">{particle.emitters.length} emitters</p>
                </div>
                <div className="status-indicator active"></div>
              </div>

              {/* Emitters */}
              <AnimatePresence>
                {expandedParticles.has(particle.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {particle.emitters.map((emitter) => {
                      const isSelected = state.selectedEmitters.some(e => e.id === emitter.id)
                      return (
                        <motion.div
                          key={emitter.id}
                          className={`
                            ml-8 p-3 border-l-2 hover:bg-white/5 cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-purple-500 bg-purple-500/10' 
                              : 'border-gray-700 hover:border-gray-600'
                            }
                          `}
                          onClick={() => toggleEmitterSelection(emitter)}
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center
                              ${isSelected 
                                ? 'border-purple-500 bg-purple-500' 
                                : 'border-gray-600'
                              }
                            `}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-sm"
                                />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-white">{emitter.name}</h4>
                              <p className="text-xs text-gray-400">{emitter.type}</p>
                            </div>

                            {/* Color Preview */}
                            <div className="flex items-center gap-1">
                              {Object.entries(emitter.colors).map(([key, color]) => (
                                <div
                                  key={key}
                                  className="w-3 h-3 rounded-sm border border-gray-600"
                                  style={{ backgroundColor: color }}
                                  title={key.toUpperCase()}
                                />
                              ))}
                            </div>

                            <Zap className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-gray-600'}`} />
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredParticles.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No particles found</p>
            <p className="text-xs mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParticleList