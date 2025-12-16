import React from 'react'
import Liveclock from "./Liveclock";




function Watermark({ user }) {
    return (
        <div className="bg-[#fffbf05e] rounded-sm z-0 p-1 inline-flex items-center gap-1">
            <img src='/logo.png' className='h-8 sm:h-10 z-0 opacity-80' />
            <div className='opacity-80 z-0'>
                <p className="text-black text-[10px] z-0">{user.email_id}</p>
                <Liveclock />
            </div>
        </div>
    )
}

export default Watermark
