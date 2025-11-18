import React from 'react'
import Liveclock from "./Liveclock";




function Watermark({ user }) {
    return (
        <div className=" inline-block">
            <div className="bg-[#FFFBF0ff] opacity-[0.6] rounded-sm p-1 z-0 inline-block">
                <p className="text-black text-xs">{user.email_id}</p>
                <Liveclock />
            </div>
        </div>

    )
}

export default Watermark
