import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect, accept = ".bin,.json", children }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleClick} className="flex-1">
        {children}
      </button>
    </>
  );
};

export default FileUpload;