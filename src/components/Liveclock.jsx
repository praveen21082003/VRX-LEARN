import React, { useEffect, useState } from "react";


function Liveclock() {
    const [Time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-black flex text-xs font-semibold">
            <p>{Time.toLocaleDateString()} ({Time.toLocaleTimeString()})</p>
        </div>
    );
}

export default Liveclock;
