import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="modal-bg">
      <div className="flex flex-col" style={{ alignItems: 'center', gap: '1rem' }}>
        <div className="spinner"></div>
        <div className="label">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;