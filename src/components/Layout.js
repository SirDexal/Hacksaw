import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/splash', title: 'Splash', icon: '🎨' },
    { path: '/stitch', title: 'Stitch', icon: '🧵' },
    { path: '/bintex', title: 'BinTex', icon: '📋' },
    { path: '/mover', title: 'Particle Mover', icon: '📦' },
    { path: '/colorswap', title: 'Color Swap', icon: '🎭' },
    { path: '/xrgba', title: 'xrgba', icon: '🎨' },
    { path: '/settings', title: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="flex">
      <div className="nav-bar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="icon">{item.icon}</div>
            <div className="tab-title">{item.title}</div>
          </Link>
        ))}
      </div>
      <div className="main">
        <div className="tab">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;