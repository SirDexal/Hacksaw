import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FileUpload from '../components/FileUpload';
import { FileHandler } from '../utils/fileHandler';
import { ColorHandler } from '../utils/colorHandler';

const ColorSwap = () => {
  const { state, dispatch } = useApp();
  const [colors, setColors] = useState([]);
  const [swapColors, setSwapColors] = useState([]);

  const handleFileSelect = async (file) => {
    try {
      const fileData = await FileHandler.processParticleFile(file);
      dispatch({ 
        type: 'SET_ACTIVE_FILE', 
        payload: { file: fileData.content, path: fileData.path }
      });
      
      // Extract unique colors from the file
      const extractedColors = extractColorsFromFile(fileData.content);
      setColors(extractedColors);
      setSwapColors(extractedColors.map(color => color));
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const extractColorsFromFile = (fileContent) => {
    const colorSet = new Set();
    
    if (fileContent?.entries?.value?.items) {
      fileContent.entries.value.items.forEach(container => {
        if (container.value?.name === 'VfxSystemDefinitionData') {
          // Extract colors from particle systems
          const colors = extractColorsFromContainer(container);
          colors.forEach(color => colorSet.add(color));
        }
      });
    }
    
    return Array.from(colorSet);
  };

  const extractColorsFromContainer = (container) => {
    const colors = [];
    
    // Simplified color extraction - in reality this would be more complex
    const colorItems = container.value.items?.filter(item => 
      item.key?.includes('color') || item.key?.includes('Color')
    ) || [];
    
    colorItems.forEach(item => {
      if (item.value?.items) {
        const constantValue = item.value.items.find(subItem => 
          subItem.key === 'constantValue' && subItem.type === 'vec4'
        );
        if (constantValue?.value) {
          const colorHandler = new ColorHandler(constantValue.value);
          colors.push(colorHandler.toHex());
        }
      }
    });
    
    return colors;
  };

  const handleSwapColorChange = (index, newColor) => {
    const newSwapColors = [...swapColors];
    newSwapColors[index] = newColor;
    setSwapColors(newSwapColors);
  };

  const swapColors = () => {
    if (!state.activeFile) return;
    
    // Add to history
    dispatch({ type: 'ADD_TO_HISTORY', payload: state.activeFile });
    
    // Apply color swapping logic
    const updatedFile = applyColorSwap(state.activeFile, colors, swapColors);
    dispatch({ 
      type: 'SET_ACTIVE_FILE', 
      payload: { file: updatedFile, path: state.filePath }
    });
    
    // Refresh colors display
    const newColors = extractColorsFromFile(updatedFile);
    setColors(newColors);
    setSwapColors(newColors.map(color => color));
  };

  const applyColorSwap = (fileContent, originalColors, newColors) => {
    // Deep clone the file content
    const updatedContent = JSON.parse(JSON.stringify(fileContent));
    
    // Apply color swapping throughout the file
    // This is a simplified implementation
    if (updatedContent?.entries?.value?.items) {
      updatedContent.entries.value.items.forEach(container => {
        if (container.value?.name === 'VfxSystemDefinitionData') {
          swapColorsInContainer(container, originalColors, newColors);
        }
      });
    }
    
    return updatedContent;
  };

  const swapColorsInContainer = (container, originalColors, newColors) => {
    // Recursively find and replace colors
    const swapInObject = (obj) => {
      if (Array.isArray(obj)) {
        obj.forEach(swapInObject);
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (key === 'value' && Array.isArray(obj[key]) && obj[key].length === 4) {
            // This might be a color vec4
            const colorHandler = new ColorHandler(obj[key]);
            const hexColor = colorHandler.toHex();
            const colorIndex = originalColors.indexOf(hexColor);
            
            if (colorIndex >= 0 && newColors[colorIndex]) {
              const newColorHandler = new ColorHandler();
              newColorHandler.inputHex(newColors[colorIndex]);
              obj[key] = newColorHandler.vec4;
            }
          } else {
            swapInObject(obj[key]);
          }
        });
      }
    };
    
    swapInObject(container);
  };

  const save = () => {
    if (state.activeFile) {
      const content = JSON.stringify(state.activeFile, null, 2);
      FileHandler.downloadFile(content, 'color_swapped_particles.json');
    }
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <div className="input-group margin-bottom">
        <FileUpload onFileSelect={handleFileSelect}>
          Open Bin
        </FileUpload>
      </div>

      <div className="input-group margin-bottom">
        <div className="label flex-1">
          <strong>{state.filePath ? state.filePath.split('\\').pop() : 'Select a file'}</strong>
        </div>
      </div>

      <div className="target-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '2rem',
        padding: '1rem',
        margin: '1rem 0'
      }}>
        {colors.map((color, index) => (
          <div key={index} className="input-group">
            <input
              type="color"
              value={color}
              disabled
              className="flex-2"
            />
            <div style={{ 
              display: 'grid', 
              placeItems: 'center',
              fontSize: '1.2rem',
              color: 'var(--accent)'
            }}>
              →
            </div>
            <input
              type="color"
              value={swapColors[index] || color}
              onChange={(e) => handleSwapColorChange(index, e.target.value)}
              className="flex-2"
            />
          </div>
        ))}
      </div>

      <div className="input-group margin-top">
        <button onClick={swapColors} className="flex-1">
          <strong>Swap</strong>
        </button>
        <button onClick={save} className="flex-1 special-input">
          Save
        </button>
      </div>
    </div>
  );
};

export default ColorSwap;