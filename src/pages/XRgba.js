import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ColorHandler } from '../utils/colorHandler';

const XRgba = () => {
  const { state, dispatch } = useApp();
  const [color, setColor] = useState(new ColorHandler());
  const [hexValue, setHexValue] = useState(color.toHex());
  const [xrgbaValue, setXrgbaValue] = useState('{ 1, 0.5, 0.25, 1 }');

  const updateAllFields = (newColor) => {
    setColor(newColor);
    setHexValue(newColor.toHex());
    const rounded = newColor.vec4.map(v => Math.ceil(v * 10000000) / 10000000);
    setXrgbaValue(`{ ${rounded.join(', ')} }`);
  };

  const handleColorInputChange = (e) => {
    const newColor = new ColorHandler(color.vec4);
    newColor.inputHex(e.target.value);
    updateAllFields(newColor);
  };

  const handleHexChange = (e) => {
    let hex = e.target.value;
    if (!hex.startsWith('#')) hex = '#' + hex;
    while (hex.length < 7) hex += '0';
    
    setHexValue(hex);
    
    if (hex.match(/^#[0-9A-F]{6}$/i)) {
      const newColor = new ColorHandler(color.vec4);
      newColor.inputHex(hex);
      updateAllFields(newColor);
    }
  };

  const handleXrgbaChange = (e) => {
    const value = e.target.value;
    setXrgbaValue(value);
    
    try {
      const values = value.slice(1, -1).split(',').map(v => parseFloat(v.trim()));
      if (values.length === 4 && values.every(v => !isNaN(v))) {
        const newColor = new ColorHandler(values);
        updateAllFields(newColor);
      }
    } catch (error) {
      // Invalid format, ignore
    }
  };

  const handleComponentChange = (component, value) => {
    const newVec4 = [...color.vec4];
    const componentIndex = { r: 0, g: 1, b: 2, a: 3 }[component];
    newVec4[componentIndex] = parseFloat(value) || 0;
    
    const newColor = new ColorHandler(newVec4);
    updateAllFields(newColor);
  };

  const saveColor = () => {
    dispatch({ 
      type: 'ADD_XRGBA_COLOR', 
      payload: {
        vec4: color.vec4,
        hex: color.toHex(),
        timestamp: Date.now()
      }
    });
  };

  const loadColor = (savedColor) => {
    const newColor = new ColorHandler(savedColor.vec4);
    updateAllFields(newColor);
  };

  const removeColor = (index) => {
    dispatch({ type: 'REMOVE_XRGBA_COLOR', payload: index });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hexValue);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <div className="input-group margin-bottom">
        <button onClick={copyToClipboard}>EyeDropper</button>
        <input
          type="color"
          value={hexValue}
          onChange={handleColorInputChange}
        />
        <div className="label">Hex:</div>
        <input
          className="flex-auto filter-input"
          value={hexValue}
          onChange={handleHexChange}
          maxLength={7}
          placeholder="#FFFFFF"
        />
        <button className="flex-1" onClick={saveColor}>
          Save Color
        </button>
      </div>

      <div className="flex-col margin-bottom">
        <div className="input-group margin-bottom">
          <div className="label">XRGBA:</div>
          <input
            className="flex-1 filter-input"
            value={xrgbaValue}
            onChange={handleXrgbaChange}
            placeholder="{ 1, 0.5, 0.25, 1 }"
          />
        </div>
        
        <div className="input-group">
          <div className="label">XR:</div>
          <input
            type="number"
            className="flex-1"
            value={color.vec4[0]}
            onChange={(e) => handleComponentChange('r', e.target.value)}
            step="0.0001"
          />
          <div className="label">XG:</div>
          <input
            type="number"
            className="flex-1"
            value={color.vec4[1]}
            onChange={(e) => handleComponentChange('g', e.target.value)}
            step="0.0001"
          />
          <div className="label">XB:</div>
          <input
            type="number"
            className="flex-1"
            value={color.vec4[2]}
            onChange={(e) => handleComponentChange('b', e.target.value)}
            step="0.0001"
          />
          <div className="label">XA:</div>
          <input
            type="number"
            className="flex-1"
            value={color.vec4[3]}
            onChange={(e) => handleComponentChange('a', e.target.value)}
            step="0.0001"
          />
        </div>
      </div>

      <div className="particle-list">
        {state.xrgbaColors.map((savedColor, index) => (
          <div 
            key={index} 
            className="input-group margin-bottom pointer"
            style={{ 
              backgroundColor: `rgb(${savedColor.vec4[0] * 255}, ${savedColor.vec4[1] * 255}, ${savedColor.vec4[2] * 255})`,
              padding: '0.5rem',
              borderRadius: '0.4rem'
            }}
            onClick={() => loadColor(savedColor)}
          >
            <div className="label flex-1">{savedColor.hex}</div>
            <button onClick={(e) => {
              e.stopPropagation();
              removeColor(index);
            }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default XRgba;