import React from 'react'

function VideoLoading() {
    return (
        <div className="w-full h-[300px] sm:h-[300px] lg:h-[420px] 
                  bg-gray-200 animate-pulse rounded-lg shadow-inner
                  flex items-center justify-center">
            <div className="relative h-40 w-40 rounded-full overflow-hidden flex items-center justify-center bg-sky-400">
                <video
                    src="/loadinglearn.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    className="h-full w-full"
                />
                <p className="absolute text-sm bottom-2">Loading...</p>
            </div>
        </div>
    )
}

export default VideoLoading
