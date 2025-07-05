import React from 'react';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { state, dispatch } = useApp();

  const handlePreferenceChange = (key, value) => {
    dispatch({
      type: 'SET_PREFERENCES',
      payload: { [key]: value }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="input-group margin-bottom">
        <button className="flex-1" disabled>
          Select Ritobin_cli.exe (Web version - not available)
        </button>
      </div>

      <div className="input-group margin-bottom">
        <div className="label flex-1">Preferred color assignment</div>
        <select 
          className="flex-1"
          value={state.preferences.preferredMode}
          onChange={(e) => handlePreferenceChange('preferredMode', e.target.value)}
        >
          <option value="random">Random</option>
          <option value="linear">Linear</option>
          <option value="wrap">Wrap</option>
          <option value="semi-override">Semi-Override</option>
          <option value="shift">Shift</option>
        </select>
      </div>

      <div className="input-group margin-bottom">
        <input
          type="checkbox"
          className="checkbox"
          checked={state.preferences.ignoreBW}
          onChange={(e) => handlePreferenceChange('ignoreBW', e.target.checked)}
        />
        <div className="label flex-1">Ignore Black/White values</div>
      </div>

      <div className="input-group margin-bottom">
        <input
          type="checkbox"
          className="checkbox"
          checked={state.preferences.regenerate}
          onChange={(e) => handlePreferenceChange('regenerate', e.target.checked)}
        />
        <div className="label flex-1">Regenerate JSON on open</div>
      </div>

      <div className="input-group margin-bottom">
        <input
          type="checkbox"
          className="checkbox"
          checked={state.preferences.generateMissing}
          onChange={(e) => handlePreferenceChange('generateMissing', e.target.checked)}
        />
        <div className="label flex-1">Generate bintex output .json files</div>
      </div>

      <div className="usage-information">
        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Web Version Notes</h3>
        <p>This is a web-based version of Hacksaw. Some features that require desktop file system access are not available:</p>
        <ul>
          <li>Direct .bin file processing (requires ritobin_cli.exe)</li>
          <li>Automatic file system operations</li>
          <li>Direct WAD folder access</li>
        </ul>
        <p>You can still work with .json files and use most color manipulation features.</p>
      </div>
    </div>
  );
};

export default Settings;