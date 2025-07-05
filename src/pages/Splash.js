import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ColorHandler, toBG } from '../utils/colorHandler';
import { FileHandler } from '../utils/fileHandler';
import FileUpload from '../components/FileUpload';
import ColorPicker from '../components/ColorPicker';
import LoadingSpinner from '../components/LoadingSpinner';

const Splash = () => {
  const { state, dispatch } = useApp();
  const [palette, setPalette] = useState(state.palette);
  const [colorCount, setColorCount] = useState(2);
  const [mode, setMode] = useState(state.preferences.preferredMode);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [filter, setFilter] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [particles, setParticles] = useState([]);
  const [targets, setTargets] = useState(state.preferences.targets);

  useEffect(() => {
    // Update palette when color count changes
    const newPalette = [...palette];
    if (newPalette.length < colorCount) {
      for (let i = newPalette.length; i < colorCount; i++) {
        newPalette.push(new ColorHandler());
      }
    } else if (newPalette.length > colorCount) {
      newPalette.splice(colorCount);
    }
    
    // Update time values
    newPalette.forEach((color, index) => {
      color.time = colorCount > 1 ? index / (colorCount - 1) : 0;
    });
    
    setPalette(newPalette);
    dispatch({ type: 'SET_PALETTE', payload: newPalette });
  }, [colorCount]);

  const handleFileSelect = async (file) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const fileData = await FileHandler.processParticleFile(file);
      dispatch({ 
        type: 'SET_ACTIVE_FILE', 
        payload: { file: fileData.content, path: fileData.path }
      });
      
      // Extract particles from file
      const extractedParticles = extractParticlesFromFile(fileData.content);
      setParticles(extractedParticles);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
          
          const emitters = [];
          const complexEmitters = container.value.items?.filter(
            item => item.key === 'complexEmitterDefinitionData' || 
                   item.key === 'simpleEmitterDefinitionData'
          ) || [];
          
          complexEmitters.forEach(emitterDef => {
            emitterDef.value.items?.forEach(emitter => {
              const emitterName = emitter.items?.find(
                item => item.key === 'emitterName'
              )?.value || 'Unknown Emitter';
              
              emitters.push({
                name: emitterName,
                colors: extractColorsFromEmitter(emitter.items),
                selected: false
              });
            });
          });
          
          particles.push({
            id: container.key || index,
            name: particleName,
            emitters,
            selected: false
          });
        }
      });
    }
    
    return particles;
  };

  const extractColorsFromEmitter = (emitterItems) => {
    const colors = {};
    
    emitterItems?.forEach(item => {
      if (item.key === 'color' && item.value?.items) {
        const colorValue = item.value.items.find(
          subItem => subItem.key === 'constantValue'
        );
        if (colorValue?.value) {
          colors.main = new ColorHandler(colorValue.value);
        }
      }
      // Add more color extraction logic for other color types
    });
    
    return colors;
  };

  const handleColorClick = (index) => {
    setSelectedColorIndex(index);
  };

  const handleColorChange = (newColor) => {
    const newPalette = [...palette];
    newPalette[selectedColorIndex] = newColor;
    setPalette(newPalette);
    dispatch({ type: 'SET_PALETTE', payload: newPalette });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    dispatch({ 
      type: 'SET_PREFERENCES', 
      payload: { preferredMode: newMode }
    });
  };

  const handleTargetChange = (index, checked) => {
    const newTargets = [...targets];
    newTargets[index] = checked;
    setTargets(newTargets);
    dispatch({ 
      type: 'SET_PREFERENCES', 
      payload: { targets: newTargets }
    });
  };

  const applyColorShift = () => {
    const newPalette = palette.map(color => {
      const newColor = new ColorHandler(color.vec4, color.time);
      newColor.hslShift(hue, saturation, lightness);
      return newColor;
    });
    setPalette(newPalette);
    dispatch({ type: 'SET_PALETTE', payload: newPalette });
  };

  const invertColors = () => {
    const newPalette = palette.map(color => {
      const inverse = [
        1 - color.vec4[0],
        1 - color.vec4[1],
        1 - color.vec4[2],
        color.vec4[3]
      ];
      return new ColorHandler(inverse, color.time);
    });
    setPalette(newPalette);
    dispatch({ type: 'SET_PALETTE', payload: newPalette });
  };

  const reversePalette = () => {
    const timeArray = palette.map(color => color.time);
    const newPalette = [...palette].reverse();
    newPalette.forEach((color, index) => {
      color.setTime(timeArray[index]);
    });
    setPalette(newPalette);
    dispatch({ type: 'SET_PALETTE', payload: newPalette });
  };

  const recolorSelected = () => {
    // Add selected particles to history
    if (state.activeFile) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: state.activeFile });
    }
    
    // Apply recoloring logic here
    console.log('Recoloring selected particles with mode:', mode);
    // This would contain the actual recoloring logic
  };

  const saveBin = () => {
    if (state.activeFile) {
      const content = JSON.stringify(state.activeFile, null, 2);
      FileHandler.downloadFile(content, 'modified_particles.json');
    }
  };

  const undo = () => {
    dispatch({ type: 'POP_HISTORY' });
  };

  const filteredParticles = particles.filter(particle =>
    particle.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {state.loading && <LoadingSpinner message="Processing file..." />}
      
      {selectedColorIndex !== null && (
        <ColorPicker
          color={palette[selectedColorIndex]}
          onChange={handleColorChange}
          onClose={() => setSelectedColorIndex(null)}
        />
      )}

      <div className="input-group margin-bottom">
        <FileUpload onFileSelect={handleFileSelect}>
          Open Bin
        </FileUpload>
        <div className="label flex-1">
          <strong>
            {state.filePath ? state.filePath.split('\\').pop() : '← Select a file'}
          </strong>
        </div>
        <div className="label">Mode:</div>
        <select value={mode} onChange={(e) => handleModeChange(e.target.value)}>
          <option value="random">Random</option>
          <option value="linear">Linear</option>
          <option value="wrap">Wrap</option>
          <option value="semi-override">Semi-Override</option>
          <option value="shift">Shift</option>
          <option value="inverse">Inverse</option>
        </select>
      </div>

      <div className="flex-col margin-bottom">
        <div 
          className="gradient-indicator"
          style={{ 
            background: palette.length > 1 ? toBG(palette) : palette[0]?.toHex() || '#000000'
          }}
        />
        <div 
          className="color-container"
          style={{ gridTemplateColumns: `repeat(${palette.length}, minmax(0px, 1fr))` }}
        >
          {palette.map((color, index) => (
            <div
              key={index}
              className="color"
              style={{ backgroundColor: color.toHex() }}
              onClick={() => handleColorClick(index)}
            />
          ))}
        </div>
        <input
          className="range margin-top"
          type="range"
          min="1"
          max="20"
          value={colorCount}
          onChange={(e) => setColorCount(parseInt(e.target.value))}
        />
      </div>

      <div className="input-group margin-bottom" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr auto 1fr auto' }}>
        <div className="label">Hue:</div>
        <input
          type="number"
          value={hue}
          onChange={(e) => setHue(e.target.value)}
          placeholder="-360 to 360"
          min="-360"
          max="360"
        />
        <div className="label">Saturation:</div>
        <input
          type="number"
          value={saturation}
          onChange={(e) => setSaturation(e.target.value)}
          placeholder="-100 to 100"
          min="-100"
          max="100"
        />
        <div className="label">Lightness:</div>
        <input
          type="number"
          value={lightness}
          onChange={(e) => setLightness(e.target.value)}
          placeholder="-100 to 100"
          min="-100"
          max="100"
        />
        <div className="dropdown">
          <button>Color Palette</button>
          <div className="dropdown-content">
            <button onClick={() => dispatch({ type: 'ADD_SAMPLE', payload: { name: `Sample ${state.samples.length + 1}`, palette } })}>
              <strong>Save</strong>
            </button>
            <button onClick={reversePalette}>Reverse</button>
            <button onClick={applyColorShift}>Shift</button>
            <button onClick={invertColors}>Inverse</button>
          </div>
        </div>
      </div>

      <div className="input-group margin-bottom" style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr auto auto auto auto auto auto auto auto auto', gap: '0.32rem' }}>
        <input
          type="checkbox"
          className="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            setParticles(particles.map(p => ({ ...p, selected: checked })));
          }}
        />
        <input
          className="filter-input flex-3"
          type="text"
          placeholder="Filter by Particle Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {['OC', 'RC', 'LC', 'BC', 'Main Color'].map((label, index) => (
          <label key={label} className="label" style={{ padding: '0.4rem' }}>
            <input
              type="checkbox"
              className="type-checkbox"
              checked={targets[index]}
              onChange={(e) => handleTargetChange(index, e.target.checked)}
            />
            {label}
          </label>
        ))}
        <div className="label" style={{ padding: '0.5rem', textAlign: 'center' }}>BM</div>
        <div className="label" style={{ padding: '0.5rem', textAlign: 'center' }}>ON</div>
        <button className="special-input" style={{ width: '2rem' }}>?</button>
      </div>

      <div className="particle-list margin-bottom">
        {filteredParticles.map((particle) => (
          <div key={particle.id} className="particle-div">
            <div className="particle-title-div flex">
              <input
                type="checkbox"
                className="checkbox"
                checked={particle.selected}
                onChange={(e) => {
                  const newParticles = particles.map(p =>
                    p.id === particle.id ? { ...p, selected: e.target.checked } : p
                  );
                  setParticles(newParticles);
                }}
              />
              <div className="label ellipsis flex-1">{particle.name}</div>
            </div>
            {particle.emitters.map((emitter, emitterIndex) => (
              <div key={emitterIndex} className="new-emitter">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={emitter.selected}
                  onChange={(e) => {
                    const newParticles = particles.map(p =>
                      p.id === particle.id
                        ? {
                            ...p,
                            emitters: p.emitters.map((em, idx) =>
                              idx === emitterIndex ? { ...em, selected: e.target.checked } : em
                            )
                          }
                        : p
                    );
                    setParticles(newParticles);
                  }}
                />
                <div className="label flex-1 ellipsis">{emitter.name}</div>
                <div className="prop-block-secondary blank-obj" />
                <div className="prop-block-secondary blank-obj" />
                <div className="prop-block-secondary blank-obj" />
                <div className="prop-block-secondary blank-obj" />
                <div 
                  className="prop-block pointer"
                  style={{ 
                    background: emitter.colors.main ? emitter.colors.main.toHex() : '',
                    border: emitter.colors.main ? 'none' : '2px dashed var(--bg-300)'
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="input-group">
        <button onClick={undo} className="flex-1">Undo</button>
        <button onClick={recolorSelected} className="flex-3" style={{ color: '#ffc24f' }}>
          Recolor Selected
        </button>
        <button className="flex-1">
          <b>Take colors from old bin</b>
        </button>
      </div>

      <div className="input-group margin-top">
        <button onClick={saveBin} className="flex-1 special-input">
          Save Bin
        </button>
      </div>
    </div>
  );
};

export default Splash;