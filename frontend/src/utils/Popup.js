// Popup.js
import React, { useEffect } from 'react';

const Popup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
