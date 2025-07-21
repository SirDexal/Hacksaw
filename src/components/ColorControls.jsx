import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Pipette, Copy, Cast as Paste, RotateCcw } from 'lucide-react'
import { ColorHandler } from '../utils/colorHandler'

const ColorControls = ({ selectedColors, onColorChange }) => {
  const [activeColorPicker, setActiveColorPicker] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const colorFields = [
    { key: 'oc', label: 'Outer Color', description: 'Outline and edge effects' },
    { key: 'rc', label: 'Ring Color', description: 'Ring and halo effects' },
    { key: 'lc', label: 'Light Color', description: 'Light emission and glow' },
    { key: 'bc', label: 'Base Color', description: 'Base particle color' },
    { key: 'main', label: 'Main Color', description: 'Primary particle color' }
  ]

  const handleColorChange = (colorKey, color) => {
    const colorValue = typeof color === 'string' ? color : color.hex;
    onColorChange({
      ...selectedColors,
      [colorKey]: colorValue
    })
  }

  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
  }

  const pasteColor = async (colorKey) => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.match(/^#[0-9A-F]{6}$/i)) {
        onColorChange({
          ...selectedColors,
          [colorKey]: text
        })
      }
    } catch (err) {
      console.error('Failed to paste color:', err)
    }
  }

  const resetColors = () => {
    onColorChange({
      oc: '#8B5CF6',
      rc: '#A855F7',
      lc: '#C084FC',
      bc: '#D8B4FE',
      main: '#8B5CF6'
    })
  }

  const generateHarmony = (baseColor, type) => {
    // Simple color harmony generation
    const hsl = hexToHsl(baseColor)
    let colors = {}
    
    switch (type) {
      case 'monochromatic':
        colors = {
          oc: hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 0.3)),
          rc: hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 0.15)),
          lc: baseColor,
          bc: hslToHex(hsl.h, hsl.s, Math.min(1, hsl.l + 0.15)),
          main: hslToHex(hsl.h, hsl.s, Math.min(1, hsl.l + 0.3))
        }
        break
      case 'complementary':
        const compH = (hsl.h + 180) % 360
        colors = {
          oc: baseColor,
          rc: hslToHex(compH, hsl.s, hsl.l),
          lc: hslToHex(hsl.h, hsl.s * 0.7, Math.min(1, hsl.l + 0.2)),
          bc: hslToHex(compH, hsl.s * 0.7, Math.min(1, hsl.l + 0.2)),
          main: baseColor
        }
        break
      case 'triadic':
        colors = {
          oc: baseColor,
          rc: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          lc: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          bc: hslToHex(hsl.h, hsl.s * 0.5, Math.min(1, hsl.l + 0.3)),
          main: baseColor
        }
        break
    }
    
    onColorChange(colors)
  }

  // Simple color picker component
  const SimpleColorPicker = ({ color, onChange }) => (
    <div className="space-y-3">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 rounded-lg border border-gray-600 cursor-pointer"
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">R</label>
          <input
            type="number"
            min="0"
            max="255"
            value={parseInt(color.slice(1, 3), 16)}
            onChange={(e) => {
              const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
              const hex = color.slice(0, 1) + r.toString(16).padStart(2, '0') + color.slice(3);
              onChange(hex);
            }}
            className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">G</label>
          <input
            type="number"
            min="0"
            max="255"
            value={parseInt(color.slice(3, 5), 16)}
            onChange={(e) => {
              const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
              const hex = color.slice(0, 3) + g.toString(16).padStart(2, '0') + color.slice(5);
              onChange(hex);
            }}
            className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">B</label>
          <input
            type="number"
            min="0"
            max="255"
            value={parseInt(color.slice(5, 7), 16)}
            onChange={(e) => {
              const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
              const hex = color.slice(0, 5) + b.toString(16).padStart(2, '0');
              onChange(hex);
            }}
            className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm"
          />
        </div>
      </div>
    </div>
  );
  // Helper functions for color conversion
  const hexToHsl = (hex) => {
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

    return { h: h * 360, s, l }
  }

  const hslToHex = (h, s, l) => {
    h /= 360
    const a = s * Math.min(l, 1 - l)
    const f = n => {
      const k = (n + h * 12) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  return (
    <div className="glass rounded-lg overflow-hidden">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-purple-400" />
          <span>Color Controls</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
          <button
            onClick={resetColors}
            className="p-1 text-gray-400 hover:text-white"
            title="Reset Colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Color Fields */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {colorFields.map((field) => (
            <motion.div
              key={field.key}
              className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              {/* Color Preview */}
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer hover-glow"
                style={{ backgroundColor: selectedColors[field.key] }}
                onClick={() => setActiveColorPicker(activeColorPicker === field.key ? null : field.key)}
              />

              {/* Field Info */}
              <div className="flex-1">
                <h3 className="font-medium text-white">{field.label}</h3>
                <p className="text-xs text-gray-400">{field.description}</p>
              </div>

              {/* Hex Input */}
              <input
                type="text"
                value={selectedColors[field.key]}
                onChange={(e) => handleColorChange(field.key, e.target.value)}
                className="w-20 px-2 py-1 bg-black/30 border border-gray-600 rounded text-white text-sm font-mono focus:border-purple-500 focus:outline-none"
              />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyColor(selectedColors[field.key])}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Copy Color"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => pasteColor(field.key)}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Paste Color"
                >
                  <Paste className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Color Picker */}
        {activeColorPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <SimpleColorPicker
              color={selectedColors[activeColorPicker]}
              onChange={(color) => handleColorChange(activeColorPicker, color)}
            />
          </motion.div>
        )}

        {/* Advanced Controls */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-gray-700 pt-4"
          >
            <h4 className="font-medium text-white mb-3">Color Harmony</h4>
            <div className="flex gap-2">
              <button
                onClick={() => generateHarmony(selectedColors.main, 'monochromatic')}
                className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30"
              >
                Monochromatic
              </button>
              <button
                onClick={() => generateHarmony(selectedColors.main, 'complementary')}
                className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30"
              >
                Complementary
              </button>
              <button
                onClick={() => generateHarmony(selectedColors.main, 'triadic')}
                className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30"
              >
                Triadic
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ColorControls