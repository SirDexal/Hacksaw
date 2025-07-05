import React, { useState } from 'react';

const BinTex = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Select a WAD folder to begin');
  const [unusedFiles, setUnusedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFolderSelect = () => {
    // In a real implementation, this would use the File System Access API
    // For now, we'll simulate the process
    setIsProcessing(true);
    setStatus('Processing files...');
    
    // Simulate processing
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setStatus('Processing complete');
        
        // Mock unused files
        setUnusedFiles([
          'assets/characters/unused_texture.dds',
          'assets/particles/old_effect.bin',
          'assets/sounds/unused_sound.wem'
        ]);
      }
    }, 200);
  };

  const deleteUnusedFiles = () => {
    // In a real implementation, this would delete the files
    setUnusedFiles([]);
    setStatus('Unused files deleted');
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <div className="input-group margin-bottom">
        <button className="flex-1" onClick={handleFolderSelect} disabled={isProcessing}>
          Select Wad Folder
        </button>
      </div>

      <div className="input-group margin-bottom">
        <div className="label flex-1">{status}</div>
        <div className="progress flex-2">
          <div 
            className={`progress-bar ${progress === 100 ? 'progress-complete' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="usage-information">
        <strong>Usage Information:</strong>
        <ol>
          <li>Select a folder which contains <strong>Assets</strong> and <strong>Data</strong> folders.</li>
          <li>Upon completion it will generate:
            <ul>
              <li><strong>.BTX</strong> - temporary bin files used to read for the unused files.</li>
              <li><strong>Combined.json</strong> - Ordered list of files by path.</li>
              <li><strong>Separate.json</strong> - Ordered list of files by bin which file is mentioned in.</li>
              <li><strong>Missing.json</strong> - Files that are missing from your folder.</li>
              <li>List of files that are going to be <mark>deleted</mark> from the directory down below.</li>
            </ul>
          </li>
          <li><strong>Delete</strong> button will delete listed files from the directory.</li>
        </ol>
      </div>

      <div className="particle-list margin-bottom">
        {unusedFiles.map((file, index) => (
          <div key={index} style={{ padding: '0.5rem', borderBottom: '1px solid var(--bg-300)' }}>
            {file}
          </div>
        ))}
      </div>

      <div className="input-group">
        <button 
          onClick={deleteUnusedFiles} 
          className="flex-1"
          disabled={unusedFiles.length === 0}
        >
          <strong><mark>Delete</mark></strong>
        </button>
      </div>
    </div>
  );
};

export default BinTex;