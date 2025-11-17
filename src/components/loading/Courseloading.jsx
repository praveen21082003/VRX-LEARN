import React from 'react'

export default function Courseloading() {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">

      <div className="w-full h-28 bg-gray-300 dark:bg-gray-700"></div>


      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24 mt-4"></div>
      </div>
    </div>
  );
}



