import React from "react";
import { LockKeyholeOpen, LockKeyhole, GraduationCap, BookOpenText } from 'lucide-react';
import { useNavigate } from "react-router-dom";


function Course({ id, url, name, description, author, enrollment }) {
    const navigate = useNavigate("");

    const handleStartLearning = (courseId) => {
        if (courseId) {
            sessionStorage.setItem("fromLearnButton", id);
        }
        navigate(`/learn/${id}`);
    };


    return (
        <div className="
                    bg-slate-100 hover:bg-white rounded-lg shadow-md overflow-hidden flex flex-col
                    dark:bg-[#0A0A0A]
                    transition-all duration-100
                    hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]
                    dark:hover:shadow-gray-700
            ">
            <div className="relative">
                <img
                    src={url}
                    alt={name}
                    className="w-full h-44 sm:h-28 object-cover transition-all duration-300"
                />
            </div>

            <div className="p-3 flex flex-col justify-between flex-1">
                <div className="w-full h-5 flex items-center justify-between text-gray-500">
                    <h3 className="text-xs font-thin text-gray-800 flex gap-1 items-center leading-snug">
                        <BookOpenText className="w-4 h-4 text-indigo-500 shrink-0 self-start mt-[2px]" />
                        <span className="break-words dark:text-gray-300">{name}</span>
                    </h3>

                    <span className="flex gap-2 text-xs dark:text-gray-300">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />{author}
                    </span>
                </div>
            </div>

            <div className="flex justify-center px-1 h-24">
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {description}
                </p>
            </div>

            <div className="flex justify-center p-3">
                {enrollment && (
                    <button
                        className="bg-[#3f3f3f] rounded-lg text-white p-2 font-semibold 
                transition-all duration-300 hover:bg-black"
                        onClick={handleStartLearning}
                    >
                        Learn
                    </button>
                )}
            </div>
        </div>

    );
}

export default Course;
