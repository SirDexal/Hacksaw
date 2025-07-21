import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, RotateCcw, Play } from 'lucide-react'
import { useApp } from '../context/AppContext'

const HSLOverride = () => {
  const { state } = useApp()
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 })
  const [previewMode, setPreviewMode] = useState(false)

  const handleSliderChange = (component, value) => {
    setHsl(prev => ({ ...prev, [component]: value }))
  }

  const resetHSL = () => {
    setHsl({ h: 0, s: 0, l: 0 })
  }

  const applyToSelected = () => {
    if (state.selectedEmitters.length === 0) {
      alert('Please select emitters to apply HSL changes')
      return
    }
    
    console.log('Applying HSL changes to selected emitters:', hsl)
    // HSL application logic would go here
  }

  const sliders = [
    {
      key: 'h',
      label: 'Hue',
      min: -180,
      max: 180,
      step: 1,
      unit: '°',
      color: 'from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500'
    },
    {
      key: 's',
      label: 'Saturation',
      min: -100,
      max: 100,
      step: 1,
      unit: '%',
      color: 'from-gray-500 to-purple-500'
    },
    {
      key: 'l',
      label: 'Lightness',
      min: -100,
      max: 100,
      step: 1,
      unit: '%',
      color: 'from-black via-gray-500 to-white'
    }
  ]

  return (
    <div className="glass rounded-lg overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-purple-400" />
          <span>HSL Override</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`text-xs px-2 py-1 rounded ${
              previewMode 
                ? 'bg-purple-500 text-white' 
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            {previewMode ? 'Live' : 'Preview'}
          </button>
          <button
            onClick={resetHSL}
            className="p-1 text-gray-400 hover:text-white"
            title="Reset HSL"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* HSL Sliders */}
        <div className="space-y-6 mb-6">
          {sliders.map((slider) => (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-medium text-white">{slider.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={hsl[slider.key]}
                    onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value) || 0)}
                    min={slider.min}
                    max={slider.max}
                    className="w-16 px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm text-center focus:border-purple-500 focus:outline-none"
                  />
                  <span className="text-xs text-gray-400 w-4">{slider.unit}</span>
                </div>
              </div>
              
              <div className="relative">
                {/* Slider Track */}
                <div className={`h-3 rounded-full bg-gradient-to-r ${slider.color} opacity-75`} />
                
                {/* Slider Input */}
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={hsl[slider.key]}
                  onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                />
                
                {/* Slider Thumb */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-800 rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${((hsl[slider.key] - slider.min) / (slider.max - slider.min)) * 100}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        {(hsl.h !== 0 || hsl.s !== 0 || hsl.l !== 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-black/20 rounded-lg border border-gray-700"
          >
            <h4 className="font-medium text-white mb-2">Preview</h4>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded border border-gray-600" title="Original" />
                <div 
                  className="w-8 h-8 rounded border border-gray-600" 
                  style={{
                    backgroundColor: applyHSLToColor('#8B5CF6', hsl.h, hsl.s, hsl.l)
                  }}
                  title="Modified"
                />
              </div>
              <div className="text-sm text-gray-400">
                H: {hsl.h > 0 ? '+' : ''}{hsl.h}° 
                S: {hsl.s > 0 ? '+' : ''}{hsl.s}% 
                L: {hsl.l > 0 ? '+' : ''}{hsl.l}%
              </div>
            </div>
          </motion.div>
        )}

        {/* Apply Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={applyToSelected}
            disabled={state.selectedEmitters.length === 0}
            className="flex-1 py-3 gradient-purple text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover-lift flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Apply to Selected ({state.selectedEmitters.length})
          </button>
        </div>

        {state.selectedEmitters.length === 0 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Select emitters from the particle list to apply HSL changes
          </p>
        )}
      </div>
    </div>
  )
}

// Helper function to apply HSL changes to a color
const applyHSLToColor = (hex, hueShift, satShift, lightShift) => {
  // Convert hex to HSL
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  // Apply shifts
  h = (h * 360 + hueShift) % 360
  if (h < 0) h += 360
  h /= 360
  
  s = Math.max(0, Math.min(1, s + satShift / 100))
  l = Math.max(0, Math.min(1, l + lightShift / 100))

  // Convert back to RGB
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let newR, newG, newB
  if (s === 0) {
    newR = newG = newB = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    newR = hue2rgb(p, q, h + 1/3)
    newG = hue2rgb(p, q, h)
    newB = hue2rgb(p, q, h - 1/3)
  }

  // Convert to hex
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

export default HSLOverride