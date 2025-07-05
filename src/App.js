import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Stitch from './pages/Stitch';
import BinTex from './pages/BinTex';
import Mover from './pages/Mover';
import ColorSwap from './pages/ColorSwap';
import XRgba from './pages/XRgba';
import Settings from './pages/Settings';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/stitch" element={<Stitch />} />
            <Route path="/bintex" element={<BinTex />} />
            <Route path="/mover" element={<Mover />} />
            <Route path="/colorswap" element={<ColorSwap />} />
            <Route path="/xrgba" element={<XRgba />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;