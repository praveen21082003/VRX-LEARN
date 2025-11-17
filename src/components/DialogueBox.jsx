import React from "react";
import { CircleX, X } from "lucide-react";

function DialogueBox({ errorCode, errorMessage, error, onClose }) {
    

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.7px]"></div>
            <div className="relative w-96 bg-black/70 backdrop-blur-xl text-white 
                      rounded-2xl shadow-2xl border border-white/20 p-5 animate-scaleIn">
                <div className="flex justify-between items-center w-full  text-red-400 font-semibold text-xl">
                    <div className="flex gap-3">
                        <CircleX size={32} className="text-red-500" />
                        <span>Error Occurred</span>
                    </div>
                    <div>
                        <button onClick={onClose} className="text-white"><X /></button>
                    </div>
                </div>
                <div className="mt-4 bg-white/90 text-black rounded-lg p-3 
                        text-center font-semibold shadow-inner">
                    {errorCode} : {errorMessage}
                </div>
                <p className="mt-3 flex justify-center text-gray-200 leading-relaxed text-sm">
                    {error}
                </p>
            </div>
        </div>
    );
}

export default DialogueBox;
