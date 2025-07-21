import React from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeaderBar from './HeaderBar'
import ToolBar from './ToolBar'
import StatusBar from './StatusBar'
import { useApp } from '../context/AppContext'

const Layout = ({ children }) => {
  const { state } = useApp()
  const location = useLocation()

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      {/* Header Bar */}
      <HeaderBar />
      
      {/* Tool Bar */}
      <ToolBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
      
      {/* Loading Overlay */}
      {state.loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="glass rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="text-white font-medium">Processing...</span>
          </div>
        </motion.div>
      )}
      
      {/* Error Toast */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-20 right-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{state.error}</span>
            <button 
              onClick={() => state.clearError()}
              className="text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Layout