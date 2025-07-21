import React from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Save, Palette, Zap, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Settings = () => {
  const { state, updateSettings } = useApp()

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value })
  }

  const selectRitobinPath = async () => {
    // In a real Electron app, this would open a file dialog
    console.log('Select ritobin_cli.exe')
  }

  const settingSections = [
    {
      title: 'Ritobin Configuration',
      icon: FolderOpen,
      settings: [
        {
          key: 'ritobinPath',
          label: 'Ritobin CLI Path',
          type: 'file',
          value: state.settings.ritobinPath,
          placeholder: 'Select ritobin_cli.exe',
          action: selectRitobinPath
        }
      ]
    },
    {
      title: 'Color Assignment',
      icon: Palette,
      settings: [
        {
          key: 'colorMode',
          label: 'Default Color Mode',
          type: 'select',
          value: state.settings.colorMode,
          options: [
            { value: 'random', label: 'Random' },
            { value: 'linear', label: 'Linear' },
            { value: 'wrap', label: 'Wrap' },
            { value: 'semi-override', label: 'Semi-Override' },
            { value: 'shift', label: 'Shift' }
          ]
        },
        {
          key: 'ignoreBW',
          label: 'Ignore Black/White Values',
          type: 'toggle',
          value: state.settings.ignoreBW,
          description: 'Skip pure black (0,0,0) and white (1,1,1) colors during processing'
        }
      ]
    },
    {
      title: 'Performance',
      icon: Zap,
      settings: [
        {
          key: 'previewQuality',
          label: 'Preview Quality',
          type: 'select',
          value: state.settings.previewQuality,
          options: [
            { value: 'low', label: 'Low (Faster)' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High (Slower)' }
          ]
        },
        {
          key: 'autoBackup',
          label: 'Auto Backup',
          type: 'toggle',
          value: state.settings.autoBackup,
          description: 'Automatically create backups before making changes'
        }
      ]
    }
  ]

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'file':
        return (
          <div className="flex gap-2">
            <input
              type="text"
              value={setting.value}
              placeholder={setting.placeholder}
              readOnly
              className="flex-1 px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <button
              onClick={setting.action}
              className="px-4 py-2 gradient-purple text-white rounded-lg hover-lift"
            >
              Browse
            </button>
          </div>
        )
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            {setting.options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'toggle':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-12 h-6 rounded-full transition-colors
                ${setting.value ? 'bg-purple-500' : 'bg-gray-600'}
              `}>
                <div className={`
                  w-5 h-5 bg-white rounded-full shadow-md transform transition-transform
                  ${setting.value ? 'translate-x-6' : 'translate-x-0.5'}
                  translate-y-0.5
                `} />
              </div>
            </div>
            <span className="text-sm text-gray-300">
              {setting.value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        )
      
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        )
    }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
          <p className="text-gray-400">Configure DivineSaw to match your workflow</p>
        </motion.div>

        <div className="space-y-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-lg overflow-hidden"
              >
                <div className="panel-header flex items-center gap-3">
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span>{section.title}</span>
                </div>
                
                <div className="p-6 space-y-6">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="block text-sm font-medium text-white">
                        {setting.label}
                      </label>
                      {renderSetting(setting)}
                      {setting.description && (
                        <p className="text-xs text-gray-400">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <button className="px-6 py-3 gradient-purple text-white rounded-lg font-medium hover-lift flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings