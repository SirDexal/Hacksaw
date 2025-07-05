import React, { useState } from 'react';

const ColorPicker = ({ color, onChange, onClose }) => {
  const [hexValue, setHexValue] = useState(color.toHex());
  const [alpha, setAlpha] = useState(color.a);

  const handleHexChange = (e) => {
    const hex = e.target.value;
    setHexValue(hex);
    if (hex.match(/^#[0-9A-F]{6}$/i)) {
      const newColor = { ...color };
      newColor.inputHex(hex);
      onChange(newColor);
    }
  };

  const handleAlphaChange = (e) => {
    const alphaValue = parseFloat(e.target.value);
    setAlpha(alphaValue);
    const newColor = { ...color };
    newColor.a = alphaValue;
    newColor.vec4[3] = alphaValue / 100;
    onChange(newColor);
  };

  const handleColorInputChange = (e) => {
    const hex = e.target.value;
    setHexValue(hex);
    const newColor = { ...color };
    newColor.inputHex(hex);
    onChange(newColor);
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="flex-col">
          <div className="input-group margin-bottom">
            <button onClick={() => navigator.clipboard?.writeText(hexValue)}>
              Copy Hex
            </button>
            <input
              type="color"
              value={hexValue}
              onChange={handleColorInputChange}
            />
            <div className="label">Hex:</div>
            <input
              className="flex-1"
              value={hexValue}
              onChange={handleHexChange}
              maxLength={7}
              placeholder="#FFFFFF"
            />
          </div>
          
          <div className="input-group margin-bottom">
            <div className="label">Alpha:</div>
            <input
              className="flex-1"
              type="number"
              value={alpha}
              onChange={handleAlphaChange}
              min="0"
              max="100"
            />
          </div>

          <div className="input-group">
            <button className="flex-1" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;