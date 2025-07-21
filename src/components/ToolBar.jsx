import React from 'react'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  Save, 
  Undo, 
  Redo, 
  Play, 
  Pause, 
  RotateCcw,
  Copy,
  Paste,
  Search
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useHotkeys } from 'react-hotkeys-hook'
import { FileHandler } from '../utils/fileHandler'

const ToolBar = () => {
  const { state, undo, redo, setSearchQuery } = useApp()

  // Keyboard shortcuts
  useHotkeys('ctrl+z', undo)
  useHotkeys('ctrl+y', redo)
  useHotkeys('ctrl+o', () => handleOpenFile())
  useHotkeys('ctrl+s', () => handleSaveFile())

  const handleOpenFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bin,.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const fileData = await FileHandler.processParticleFile(file);
          // This would normally dispatch to app context
          console.log('File loaded:', fileData);
        } catch (error) {
          console.error('Error loading file:', error);
        }
      }
    };
    input.click();
  }

  const handleSaveFile = async () => {
    if (state.currentBin) {
      const content = JSON.stringify(state.currentBin, null, 2);
      FileHandler.downloadFile(content, 'modified_particles.json');
    }
  }

  const toolGroups = [
    {
      name: 'File',
      tools: [
        { 
          icon: FolderOpen, 
          label: 'Open Bin', 
          shortcut: 'Ctrl+O',
          onClick: handleOpenFile
        },
        { 
          icon: Save, 
          label: 'Save', 
          shortcut: 'Ctrl+S',
          onClick: handleSaveFile,
          disabled: !state.isModified
        }
      ]
    },
    {
      name: 'Edit',
      tools: [
        { 
          icon: Undo, 
          label: 'Undo', 
          shortcut: 'Ctrl+Z',
          onClick: undo,
          disabled: state.historyIndex <= 0
        },
        { 
          icon: Redo, 
          label: 'Redo', 
          shortcut: 'Ctrl+Y',
          onClick: redo,
          disabled: state.historyIndex >= state.history.length - 1
        }
      ]
    },
    {
      name: 'Tools',
      tools: [
        { 
          icon: Play, 
          label: 'Preview', 
          onClick: () => console.log('Preview')
        },
        { 
          icon: RotateCcw, 
          label: 'Reset Colors', 
          onClick: () => console.log('Reset')
        },
        { 
          icon: Copy, 
          label: 'Copy Selection', 
          shortcut: 'Ctrl+C',
          onClick: () => console.log('Copy')
        },
        { 
          icon: Paste, 
          label: 'Paste', 
          shortcut: 'Ctrl+V',
          onClick: () => console.log('Paste')
        }
      ]
    }
  ]

  return (
    <div className="glass border-b border-purple-500/10 px-6 py-3 flex items-center justify-between">
      {/* Tool Groups */}
      <div className="flex items-center gap-6">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.name} className="flex items-center gap-1">
            {groupIndex > 0 && <div className="divider h-6 mx-2" />}
            {group.tools.map((tool) => {
              const Icon = tool.icon
              return (
                <motion.button
                  key={tool.label}
                  onClick={tool.onClick}
                  disabled={tool.disabled}
                  className={`
                    relative p-2 rounded-md transition-all group
                    ${tool.disabled 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                  whileHover={!tool.disabled ? { scale: 1.05 } : {}}
                  whileTap={!tool.disabled ? { scale: 0.95 } : {}}
                  title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {tool.label}
                    {tool.shortcut && (
                      <span className="text-gray-400 ml-2">{tool.shortcut}</span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search emitters..."
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              pl-10 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg
              text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none
              transition-colors w-64
            "
          />
        </div>
      </div>
    </div>
  )
}

export default ToolBar