import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  preferences: {
    preferredMode: 'random',
    ignoreBW: true,
    targets: [true, true, true, true, true],
    regenerate: false,
    generateMissing: false
  },
  samples: [],
  xrgbaColors: [],
  activeFile: null,
  filePath: '',
  fileHistory: [],
  palette: [
    {
      r: 255,
      g: 128,
      b: 64,
      a: 100,
      time: 0,
      vec4: [1, 0.5, 0.25, 1]
    },
    {
      r: 64,
      g: 128,
      b: 255,
      a: 100,
      time: 1,
      vec4: [0.25, 0.5, 1, 1]
    }
  ],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    case 'SET_ACTIVE_FILE':
      return {
        ...state,
        activeFile: action.payload.file,
        filePath: action.payload.path
      };
    case 'SET_PALETTE':
      return {
        ...state,
        palette: action.payload
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        fileHistory: [...state.fileHistory, action.payload]
      };
    case 'POP_HISTORY':
      const newHistory = [...state.fileHistory];
      const lastFile = newHistory.pop();
      return {
        ...state,
        fileHistory: newHistory,
        activeFile: lastFile || state.activeFile
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'ADD_SAMPLE':
      return {
        ...state,
        samples: [...state.samples, action.payload]
      };
    case 'REMOVE_SAMPLE':
      return {
        ...state,
        samples: state.samples.filter((_, index) => index !== action.payload)
      };
    case 'ADD_XRGBA_COLOR':
      return {
        ...state,
        xrgbaColors: [...state.xrgbaColors, action.payload]
      };
    case 'REMOVE_XRGBA_COLOR':
      return {
        ...state,
        xrgbaColors: state.xrgbaColors.filter((_, index) => index !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('hacksaw-preferences');
    if (savedPrefs) {
      dispatch({
        type: 'SET_PREFERENCES',
        payload: JSON.parse(savedPrefs)
      });
    }

    const savedSamples = localStorage.getItem('hacksaw-samples');
    if (savedSamples) {
      dispatch({
        type: 'SET_SAMPLES',
        payload: JSON.parse(savedSamples)
      });
    }

    const savedXrgba = localStorage.getItem('hacksaw-xrgba');
    if (savedXrgba) {
      dispatch({
        type: 'SET_XRGBA_COLORS',
        payload: JSON.parse(savedXrgba)
      });
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('hacksaw-preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  useEffect(() => {
    localStorage.setItem('hacksaw-samples', JSON.stringify(state.samples));
  }, [state.samples]);

  useEffect(() => {
    localStorage.setItem('hacksaw-xrgba', JSON.stringify(state.xrgbaColors));
  }, [state.xrgbaColors]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}