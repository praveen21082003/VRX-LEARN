
import React, { useEffect, useState } from "react";  
import {SunDim, Moon} from "lucide-react";

function DarkModeToggle({collapsed}) {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);


    return (
        <>
            <div className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition hover:dark:text-black hover:dark:bg-[#1F2937] ">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                    <div className="flex gap-1 px-1 w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 dark:bg-gray-700 rounded-full transition-all text-black"><Moon /><SunDim /></div>
                    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
                <span>
                    {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
                </span>
            </div>
        </>

    );
}

export default DarkModeToggle;
