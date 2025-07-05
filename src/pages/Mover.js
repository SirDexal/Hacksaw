import React, { useState } from 'react';

const Mover = () => {
  const [wadPath, setWadPath] = useState('');
  const [newPath, setNewPath] = useState('');
  const [originPaths, setOriginPaths] = useState([]);
  const [redirectPaths, setRedirectPaths] = useState([]);

  const selectWadFolder = () => {
    // Simulate folder selection
    const mockPath = 'C:/Games/League/champion.wad.client';
    setWadPath(mockPath);
    
    // Mock origin paths
    const mockOriginPaths = [
      'ASSETS/Characters/Champion/Skins/Base/Particles/effect1.bin',
      'ASSETS/Characters/Champion/Skins/Base/Particles/effect2.bin',
      'ASSETS/Characters/Champion/Skins/Base/Particles/effect3.bin'
    ];
    setOriginPaths(mockOriginPaths);
  };

  const selectNewLocation = () => {
    if (!wadPath) {
      alert('Please select wad folder first');
      return;
    }
    
    // Simulate new location selection
    const mockNewPath = 'C:/Games/League/custom_champion.wad.client/particles/';
    setNewPath(mockNewPath);
    
    // Generate redirect paths
    const mockRedirectPaths = originPaths.map(path => {
      const fileName = path.split('/').pop();
      return `${mockNewPath}${fileName}`;
    });
    setRedirectPaths(mockRedirectPaths);
  };

  const moveParticles = () => {
    if (!wadPath || !newPath) {
      alert('Please select both wad folder and new location');
      return;
    }
    
    // Simulate moving particles
    alert('Particles moved successfully!');
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <div className="input-group margin-bottom">
        <button className="flex-1" onClick={selectWadFolder}>
          Select Wad Folder
        </button>
      </div>

      <div className="input-group margin-bottom">
        <button onClick={selectNewLocation}>Select New Location</button>
        <div className="label flex-1">
          <strong>{newPath || '← Select a file'}</strong>
        </div>
      </div>

      <div className="usage-information">
        <strong>Usage Information:</strong>
        <ol>
          <li>Select a WadFolder (a folder that ends with "<strong>.wad.client</strong>")</li>
          <li>Select a folder to which you want to redirect particle paths to.
            <ul>
              <li>Path must include the word "<strong>particles</strong>" if you want the ability to move particles later.</li>
            </ul>
          </li>
          <li>Confirm that the paths are as you want them to be.</li>
          <li>Press <strong>Move particles</strong> button</li>
        </ol>
      </div>

      <div className="flex" style={{ flex: 1, gap: '1rem' }}>
        <div className="target-container">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Origin Paths</h3>
          {originPaths.map((path, index) => (
            <div key={index} style={{ padding: '0.5rem', borderBottom: '1px solid var(--bg-300)' }}>
              {path}
            </div>
          ))}
        </div>

        <div className="donor-container">
          <h3 style={{ color: 'var(--accent-success)', marginBottom: '1rem' }}>Redirect Paths</h3>
          {redirectPaths.map((path, index) => (
            <div key={index} style={{ padding: '0.5rem', borderBottom: '1px solid var(--bg-300)' }}>
              {path}
            </div>
          ))}
        </div>
      </div>

      <div className="input-group margin-top">
        <button onClick={moveParticles} className="flex-1">
          <strong>Move particles</strong>
        </button>
      </div>
    </div>
  );
};

export default Mover;