import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, ArrowRight, Download, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const StitchMode = () => {
  const { state } = useApp()
  const [targetBin, setTargetBin] = useState(null)
  const [donorBin, setDonorBin] = useState(null)
  const [transferQueue, setTransferQueue] = useState([])

  const handleFileUpload = (type, file) => {
    // Mock file processing
    const mockBin = {
      name: file.name,
      path: file.path || file.name,
      emitters: [
        { id: 1, name: 'Fire_Burst', type: 'Complex', colors: 5 },
        { id: 2, name: 'Smoke_Trail', type: 'Simple', colors: 2 },
        { id: 3, name: 'Spark_Particles', type: 'Complex', colors: 3 }
      ]
    }

    if (type === 'target') {
      setTargetBin(mockBin)
    } else {
      setDonorBin(mockBin)
    }
  }

  const addToTransferQueue = (emitter) => {
    if (!transferQueue.find(item => item.id === emitter.id)) {
      setTransferQueue([...transferQueue, emitter])
    }
  }

  const removeFromTransferQueue = (emitterId) => {
    setTransferQueue(transferQueue.filter(item => item.id !== emitterId))
  }

  const executeTransfer = () => {
    // Transfer logic would go here
    console.log('Transferring emitters:', transferQueue)
    setTransferQueue([])
  }

  return (
    <div className="h-full flex gap-4 p-4">
      {/* Target Panel */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 glass rounded-lg overflow-hidden"
      >
        <div className="panel-header flex items-center justify-between">
          <span>Target Bin</span>
          {targetBin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="status-indicator active"></span>
              <span>{targetBin.emitters.length} emitters</span>
            </div>
          )}
        </div>

        <div className="p-4 h-full flex flex-col">
          {!targetBin ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Load Target Bin</h3>
              <p className="text-gray-500 text-center mb-4">
                Drop a .bin file here or click to browse
              </p>
              <button 
                onClick={() => document.getElementById('target-file').click()}
                className="px-4 py-2 gradient-purple text-white rounded-lg hover-lift"
              >
                Browse Files
              </button>
              <input
                id="target-file"
                type="file"
                accept=".bin,.json"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFileUpload('target', e.target.files[0])}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="mb-4">
                <h3 className="font-medium text-white mb-1">{targetBin.name}</h3>
                <p className="text-sm text-gray-400">{targetBin.path}</p>
              </div>
              
              <div className="space-y-2">
                {targetBin.emitters.map((emitter) => (
                  <div key={emitter.id} className="p-3 bg-black/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{emitter.name}</h4>
                        <p className="text-sm text-gray-400">{emitter.type} • {emitter.colors} colors</p>
                      </div>
                      <div className="status-indicator active"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transfer Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-64 flex flex-col gap-4"
      >
        {/* Transfer Queue */}
        <div className="glass rounded-lg overflow-hidden">
          <div className="panel-header">
            Transfer Queue ({transferQueue.length})
          </div>
          <div className="p-4 max-h-48 overflow-auto">
            {transferQueue.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No emitters queued
              </p>
            ) : (
              <div className="space-y-2">
                {transferQueue.map((emitter) => (
                  <div key={emitter.id} className="flex items-center justify-between p-2 bg-purple-500/20 rounded border border-purple-500/30">
                    <span className="text-sm text-white truncate">{emitter.name}</span>
                    <button
                      onClick={() => removeFromTransferQueue(emitter.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transfer Actions */}
        <div className="glass rounded-lg p-4">
          <button
            onClick={executeTransfer}
            disabled={transferQueue.length === 0 || !targetBin}
            className="w-full py-3 gradient-purple text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover-lift flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Transfer ({transferQueue.length})
          </button>
          
          {transferQueue.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Review conflicts before transfer</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Donor Panel */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 glass rounded-lg overflow-hidden"
      >
        <div className="panel-header flex items-center justify-between">
          <span>Donor Bin</span>
          {donorBin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="status-indicator active"></span>
              <span>{donorBin.emitters.length} emitters</span>
            </div>
          )}
        </div>

        <div className="p-4 h-full flex flex-col">
          {!donorBin ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
              <Download className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Load Donor Bin</h3>
              <p className="text-gray-500 text-center mb-4">
                Drop a .bin file here or click to browse
              </p>
              <button 
                onClick={() => document.getElementById('donor-file').click()}
                className="px-4 py-2 gradient-purple text-white rounded-lg hover-lift"
              >
                Browse Files
              </button>
              <input
                id="donor-file"
                type="file"
                accept=".bin,.json"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFileUpload('donor', e.target.files[0])}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <div className="mb-4">
                <h3 className="font-medium text-white mb-1">{donorBin.name}</h3>
                <p className="text-sm text-gray-400">{donorBin.path}</p>
              </div>
              
              <div className="space-y-2">
                {donorBin.emitters.map((emitter) => (
                  <div key={emitter.id} className="p-3 bg-black/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                       onClick={() => addToTransferQueue(emitter)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{emitter.name}</h4>
                        <p className="text-sm text-gray-400">{emitter.type} • {emitter.colors} colors</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default StitchMode