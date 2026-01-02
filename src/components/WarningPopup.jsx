import React, { useEffect } from "react";
import { Bold, X } from 'lucide-react'

function WarningPopup({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="flex justify-center items-center gap-5 fixed text-xs sm:text-sm max-w-[90%] sm:max-w-[40%] top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 
    bg-black text-white opacity-90 px-2 sm:px-6 py-5 border-l-[6px] border-green-700 rounded-lg shadow-xl z-50">
      <p className="font-semibold">{message}</p>
      <button onClick={()=> onClose()}><X size={25}/></button>
    </div>

  );
}

export default WarningPopup;
