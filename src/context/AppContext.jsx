import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  // Current project state
  currentBin: null,
  binPath: '',
  isModified: false,
  
  // UI state
  currentMode: 'color-editor',
  selectedEmitters: [],
  searchQuery: '',
  
  // Settings
  settings: {
    ritobinPath: '',
    colorMode: 'random',
    ignoreBW: true,
    autoBackup: true,
    previewQuality: 'medium'
  },
  
  // Color system
  colorPalette: [
    { id: 1, color: '#8B5CF6', name: 'Primary Purple' },
    { id: 2, color: '#A855F7', name: 'Light Purple' },
    { id: 3, color: '#C084FC', name: 'Soft Purple' },
    { id: 4, color: '#10B981', name: 'Success Green' },
    { id: 5, color: '#F59E0B', name: 'Warning Orange' },
    { id: 6, color: '#EF4444', name: 'Error Red' }
  ],
  
  // History for undo/redo
  history: [],
  historyIndex: -1,
  
  // Loading states
  loading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_BIN':
      return {
        ...state,
        currentBin: action.payload.bin,
        binPath: action.payload.path,
        isModified: false
      }
    
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload
      }
    
    case 'SET_SELECTED_EMITTERS':
      return {
        ...state,
        selectedEmitters: action.payload
      }
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case 'ADD_TO_HISTORY':
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(action.payload)
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isModified: true
      }
    
    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          historyIndex: state.historyIndex - 1,
          currentBin: state.history[state.historyIndex - 1]
        }
      }
      return state
    
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          historyIndex: state.historyIndex + 1,
          currentBin: state.history[state.historyIndex + 1]
        }
      }
      return state
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('divinesaw-settings')
    if (savedSettings) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: JSON.parse(savedSettings)
      })
    }
  }, [])
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('divinesaw-settings', JSON.stringify(state.settings))
  }, [state.settings])
  
  const value = {
    state,
    dispatch,
    
    // Helper functions
    setCurrentBin: (bin, path) => dispatch({ 
      type: 'SET_CURRENT_BIN', 
      payload: { bin, path } 
    }),
    
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    
    setSelectedEmitters: (emitters) => dispatch({ 
      type: 'SET_SELECTED_EMITTERS', 
      payload: emitters 
    }),
    
    setSearchQuery: (query) => dispatch({ 
      type: 'SET_SEARCH_QUERY', 
      payload: query 
    }),
    
    updateSettings: (settings) => dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: settings 
    }),
    
    addToHistory: (state) => dispatch({ 
      type: 'ADD_TO_HISTORY', 
      payload: state 
    }),
    
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  }
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}