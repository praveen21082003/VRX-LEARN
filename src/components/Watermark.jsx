import React from 'react'
import Liveclock from "./Liveclock";




function Watermark({ user }) {
    return (
        <div className="bg-[#fffbf057] rounded-sm z-0 p-1 inline-flex items-center gap-1">
            <img src='/logo.png' className='h-8 sm:h-10' />
            <div className='opacity-70 z-0'>
                <p className="text-black text-[10px]">{user.email_id}</p>
                <Liveclock />
            </div>
        </div>
    )
}

export default Watermark
