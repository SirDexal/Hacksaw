import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ColorEditor from './pages/ColorEditor'
import StitchMode from './pages/StitchMode'
import Settings from './pages/Settings'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ColorEditor />} />
            <Route path="/color-editor" element={<ColorEditor />} />
            <Route path="/stitch" element={<StitchMode />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App