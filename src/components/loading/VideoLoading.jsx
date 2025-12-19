import React from 'react'

function VideoLoading({ loadmsg }) {
    return (
        <div className="w-full h-[300px] sm:h-[300px] lg:h-[420px] 
                  bg-gray-200 animate-pulse rounded-lg shadow-inner
                  flex flex-col items-center justify-center">
            <div className="h-40 w-40 rounded-full overflow-hidden flex items-center justify-center bg-[#840227]">
                <video
                    src="/loadinglearn.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    className="h-full w-full"
                />
            </div>
            <p className="text-xs bottom-2">{loadmsg}</p>
        </div>
    )
}

export default VideoLoading
