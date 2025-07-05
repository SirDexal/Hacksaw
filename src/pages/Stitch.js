import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FileUpload from '../components/FileUpload';
import { FileHandler } from '../utils/fileHandler';

const Stitch = () => {
  const { state, dispatch } = useApp();
  const [targetFile, setTargetFile] = useState(null);
  const [donorFile, setDonorFile] = useState(null);
  const [targetParticles, setTargetParticles] = useState([]);
  const [donorParticles, setDonorParticles] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const handleTargetFileSelect = async (file) => {
    try {
      const fileData = await FileHandler.processParticleFile(file);
      setTargetFile(fileData);
      
      // Extract particles for display
      const particles = extractParticlesFromFile(fileData.content);
      setTargetParticles(particles);
    } catch (error) {
      console.error('Error loading target file:', error);
    }
  };

  const handleDonorFileSelect = async (file) => {
    try {
      const fileData = await FileHandler.processParticleFile(file);
      setDonorFile(fileData);
      
      // Extract particles for display
      const particles = extractParticlesFromFile(fileData.content);
      setDonorParticles(particles);
    } catch (error) {
      console.error('Error loading donor file:', error);
    }
  };

  const extractParticlesFromFile = (fileContent) => {
    const particles = [];
    
    if (fileContent?.entries?.value?.items) {
      fileContent.entries.value.items.forEach((container, index) => {
        if (container.value?.name === 'VfxSystemDefinitionData') {
          const particleName = container.value.items?.find(
            item => item.key === 'particleName'
          )?.value || `Unknown Particle ${index}`;
          
          particles.push({
            id: container.key || index,
            name: particleName,
            container: container
          });
        }
      });
    }
    
    return particles;
  };

  const moveParticleToTarget = (donorParticle) => {
    if (!selectedTarget || !targetFile) return;
    
    // Add to history
    dispatch({ type: 'ADD_TO_HISTORY', payload: targetFile.content });
    
    // Clone the donor particle and add to target
    const newParticle = JSON.parse(JSON.stringify(donorParticle.container));
    
    // Update target file
    const updatedContent = { ...targetFile.content };
    updatedContent.entries.value.items.push(newParticle);
    
    setTargetFile({ ...targetFile, content: updatedContent });
    
    // Refresh target particles list
    const updatedParticles = extractParticlesFromFile(updatedContent);
    setTargetParticles(updatedParticles);
  };

  const clearSelectedTarget = () => {
    if (!selectedTarget || !targetFile) return;
    
    // Add to history
    dispatch({ type: 'ADD_TO_HISTORY', payload: targetFile.content });
    
    // Find and clear the selected particle's emitters
    const updatedContent = { ...targetFile.content };
    const targetParticle = updatedContent.entries.value.items.find(
      item => item.key === selectedTarget
    );
    
    if (targetParticle) {
      const complexEmitterIndex = targetParticle.value.items.findIndex(
        item => item.key === 'complexEmitterDefinitionData' || 
               item.key === 'simpleEmitterDefinitionData'
      );
      
      if (complexEmitterIndex >= 0) {
        targetParticle.value.items[complexEmitterIndex].value.items = [];
      }
    }
    
    setTargetFile({ ...targetFile, content: updatedContent });
    
    // Refresh target particles list
    const updatedParticles = extractParticlesFromFile(updatedContent);
    setTargetParticles(updatedParticles);
  };

  const save = () => {
    if (targetFile) {
      const content = JSON.stringify(targetFile.content, null, 2);
      FileHandler.downloadFile(content, 'stitched_particles.json');
    }
  };

  const undo = () => {
    dispatch({ type: 'POP_HISTORY' });
    // In a real implementation, you'd restore the previous state
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <div className="input-group margin-bottom">
        <FileUpload onFileSelect={handleTargetFileSelect}>
          Open Target Bin
        </FileUpload>
        <FileUpload onFileSelect={handleDonorFileSelect}>
          Open Donor Bin
        </FileUpload>
      </div>

      <div className="input-group scroll-x margin-bottom">
        <div className="label flex-1">
          <strong>{targetFile ? targetFile.name : 'This will show target bin'}</strong>
        </div>
        <div className="label flex-1">
          <mark>{donorFile ? donorFile.name : 'This will show donor bin'}</mark>
        </div>
      </div>

      <div className="input-group margin-bottom">
        <select className="flex-1" onChange={(e) => setSelectedTarget(e.target.value)}>
          <option value="">Select Target Particle</option>
          {targetParticles.map(particle => (
            <option key={particle.id} value={particle.id}>
              {particle.name}
            </option>
          ))}
        </select>
        <select className="flex-1">
          <option value="">Select Donor Particle</option>
          {donorParticles.map(particle => (
            <option key={particle.id} value={particle.id}>
              {particle.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex" style={{ flex: 1, gap: '1rem' }}>
        <div className="target-container">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Target Particles</h3>
          {targetParticles.map(particle => (
            <div key={particle.id} className="particle-div">
              <div className="particle-title-div flex">
                <input
                  type="radio"
                  name="target"
                  className="checkbox"
                  onChange={() => setSelectedTarget(particle.id)}
                />
                <div className="label ellipsis flex-1">{particle.name}</div>
                <input
                  type="number"
                  placeholder="1.0"
                  className="input"
                  style={{ width: '4rem' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="donor-container">
          <h3 style={{ color: 'var(--accent-failure)', marginBottom: '1rem' }}>Donor Particles</h3>
          {donorParticles.map(particle => (
            <div key={particle.id} className="particle-div">
              <div className="particle-title-div flex">
                <button onClick={() => moveParticleToTarget(particle)}>
                  <strong>&lt;|</strong>
                </button>
                <div className="label ellipsis flex-1">{particle.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="input-group margin-top">
        <button onClick={undo} className="flex-1">Undo</button>
        <button onClick={clearSelectedTarget} className="flex-1">
          <mark>Clear Selected</mark>
        </button>
        <button onClick={save} className="flex-1 special-input">Save</button>
      </div>
    </div>
  );
};

export default Stitch;