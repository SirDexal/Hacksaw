import React from 'react'
import { useApp } from '../context/AppContext'
import { Clock, Users, Zap } from 'lucide-react'

const StatusBar = () => {
  const { state } = useApp()

  const getStatusInfo = () => {
    if (!state.currentBin) {
      return {
        emitterCount: 0,
        selectedCount: 0,
        status: 'No file loaded'
      }
    }

    return {
      emitterCount: state.currentBin?.emitters?.length || 0,
      selectedCount: state.selectedEmitters.length,
      status: state.isModified ? 'Modified' : 'Saved'
    }
  }

  const { emitterCount, selectedCount, status } = getStatusInfo()

  return (
    <div className="glass border-t border-purple-500/10 px-6 py-2 flex items-center justify-between text-sm">
      {/* Left side - File info */}
      <div className="flex items-center gap-6 text-gray-400">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{emitterCount} emitters</span>
        </div>
        
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">{selectedCount} selected</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${
            status === 'Modified' ? 'error' : 
            status === 'Saved' ? 'active' : 'inactive'
          }`}></div>
          <span>{status}</span>
        </div>
      </div>

      {/* Right side - Tips and shortcuts */}
      <div className="flex items-center gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Tip: Use Ctrl+Click to multi-select emitters</span>
        </div>
      </div>
    </div>
  )
}

export default StatusBar