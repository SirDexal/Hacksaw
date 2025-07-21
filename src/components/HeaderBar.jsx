import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Palette, Shuffle, Settings, Minimize2, Square, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const HeaderBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, setMode } = useApp()

  const modes = [
    { 
      id: 'color-editor', 
      label: 'Color Editor', 
      icon: Palette, 
      path: '/color-editor' 
    },
    { 
      id: 'stitch', 
      label: 'Stitch Mode', 
      icon: Shuffle, 
      path: '/stitch' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings' 
    }
  ]

  const handleModeChange = (mode) => {
    setMode(mode.id)
    navigate(mode.path)
  }

  return (
    <div className="glass border-b border-purple-500/20 px-6 py-3 flex items-center justify-between">
      {/* App Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">DivineSaw</h1>
            <p className="text-xs text-gray-400">VFX Particle Editor</p>
          </div>
        </div>
        
        {/* File Status */}
        {state.binPath && (
          <div className="flex items-center gap-2 ml-8">
            <div className={`status-indicator ${state.isModified ? 'error' : 'active'}`}></div>
            <span className="text-sm text-gray-300">
              {state.binPath.split('/').pop()}
              {state.isModified && ' *'}
            </span>
          </div>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = location.pathname === mode.path
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => handleModeChange(mode)}
              className={`
                relative px-4 py-2 rounded-md text-sm font-medium transition-all
                ${isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeMode"
                  className="absolute inset-0 gradient-purple rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Window Controls (for Electron) */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">
          <Minimize2 className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">
          <Square className="w-3 h-3" />
        </button>
        <button className="w-8 h-8 rounded-md hover:bg-red-500 flex items-center justify-center text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default HeaderBar