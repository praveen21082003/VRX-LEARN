import React from 'react'
import {BookOpen} from 'lucide-react';

function Coursecontentloading() {
    return (
        < div className="space-y-4 animate-pulse h-[60%] sm:h-auto overflow-y-scroll sm:overflow-y-auto w-full md:w-[35%] lg:w-[30%] border-r-2 border-gray-200 dark:border-gray-700 p-4" >
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Learn
            </h1>
            {/* Course Title Skeleton */}
            <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className='bg-white rounded-xl h-full p-5 w-full'>
                <div className="h-7 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="mt-5 ml-3 space-y-2 bg-white">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-7 w-40 mt-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="mt-5 ml-3 space-y-2 bg-white">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-7 w-40 mt-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="mt-5 ml-3 space-y-2 bg-white">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default Coursecontentloading
