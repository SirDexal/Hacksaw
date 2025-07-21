import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ParticleList from '../components/ParticleList'
import ColorControls from '../components/ColorControls'
import HSLOverride from '../components/HSLOverride'
import PalettePanel from '../components/PalettePanel'
import { useApp } from '../context/AppContext'

const ColorEditor = () => {
  const { state } = useApp()
  const [selectedColors, setSelectedColors] = useState({
    oc: '#8B5CF6', // Outer Color
    rc: '#A855F7', // Ring Color  
    lc: '#C084FC', // Light Color
    bc: '#D8B4FE', // Base Color
    main: '#8B5CF6' // Main Color
  })

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Left Panel - Particle List */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-80 flex flex-col"
      >
        <ParticleList />
      </motion.div>

      {/* Center Panel - Color Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col gap-4"
      >
        <ColorControls 
          selectedColors={selectedColors}
          onColorChange={setSelectedColors}
        />
        <HSLOverride />
      </motion.div>

      {/* Right Panel - Palette */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-80 flex flex-col"
      >
        <PalettePanel />
      </motion.div>
    </div>
  )
}

export default ColorEditor