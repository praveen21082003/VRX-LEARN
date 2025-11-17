import React from 'react'
import Liveclock from "./Liveclock";




function Watermark({ user }) {
    return (
        <div className="opacity-[0.3] inline-block">
            <div className="bg-[#FFFBF0ff] rounded-sm p-1 z-0 inline-block">
                <p className="text-black text-xs">{user.email_id}</p>
                <Liveclock />
            </div>
        </div>

    )
}

export default Watermark
