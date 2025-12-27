import React from 'react'
import {FileClock} from 'lucide-react';

function PdfLoading() {
  return (
    <div className="bg-gray-100 w-full h-full items-center bg-[#00000010] dark:bg-[#0A0A0A] rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
      <div className="px-3 h-12 w-full flex justify-between items-center bg-black/40 dark:bg-gray-700 ">
        <div className="sm:hidden bg-white/10 dark:bg-gray-600 rounded-full h-6 w-full"></div>
        <div className='flex gap-2 items-center'>
          <div className="sm:h-9 bg-white/10 dark:bg-gray-600 rounded-full sm:w-9"></div>
          <div className="sm:h-4 bg-white/30 dark:bg-gray-500 rounded sm:w-7"></div>
          <div className="sm:h-9 bg-white/10 dark:bg-gray-600 rounded-full sm:w-9"></div>
          <div className="sm:h-7 bg-gray-300 dark:bg-gray-700 rounded sm:w-16"></div>
        </div>
        <div className='flex items-center gap-2'>
          <div className="sm:h-5 bg-white/20 dark:bg-gray-500 sm:w-16 rounded"></div>
          <div className="sm:h-7 bg-gray-300 dark:bg-gray-600 rounded sm:w-7"></div>
          <div className="sm:h-5 bg-white/20 dark:bg-gray-500 sm:w-12 rounded"></div>
          <div className="sm:h-9 bg-white/10 dark:bg-gray-600 rounded-full sm:w-9"></div>
        </div>
      </div>
      <div className='h-full flex gap-2 items-center justify-center'>
        <div className='items-center'>
          <FileClock className='text-gray-700' size={30} />
        </div>
        <div className=''>
          <p className='font-semibold text-base text-gray-700'>Opening resource…</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This may take a few seconds
          </p>
        </div>
      </div>
    </div>
  )
}

export default PdfLoading;
