import React, { useEffect } from "react";

function WarningPopup({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed w-[90%] sm:w-[50%] top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 
    bg-black text-white opacity-85 px-2 sm:px-6 py-3 rounded-lg shadow-xl z-50">
      ⚠️ {message}
    </div>

  );
}

export default WarningPopup;
