import React, { useState } from "react";
import { LockKeyholeOpen, LockKeyhole, GraduationCap, BookOpenText } from 'lucide-react';
import { useNavigate } from "react-router-dom";


function Course({ id, url, name, description, author, enrollment }) {
    const navigate = useNavigate("");

    const handleStartLearning = (courseId) => {
        if (courseId){
            sessionStorage.setItem("fromLearnButton", id);
        }
        console.log(sessionStorage.getItem("fromLearnButton"));
        navigate(`/learn/${id}`);
    };


    return (
        <div className="bg-slate-100 rounded-lg shadow-md  overflow-hidden flex flex-col hover:shadow-2xl dark:hover:shadow-md dark:hover:dark:shadow-white transition-shadow duration-300 dark:bg-[#0A0A0A]">
            <div className="relative">
                <img
                    src={url}
                    alt={name}
                    className="w-full h-44 sm:h-28 object-cover"
                />

                {/* {
                    enrollment ?
                        (
                            <span className="flex absolute top-2 right-2 font-semibold bg-green-600 text-white text-xs p-1 rounded">
                                <LockKeyholeOpen className="h-4" />Enrolled
                            </span>
                        )
                        :
                        (
                            <span className="flex absolute top-2 right-2 font-semibold bg-red-500 text-white text-xs p-1 rounded">
                                <LockKeyhole className="h-4" />
                            </span>
                        )
                } */}

            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
                <div className="w-full h-5 flex items-center justify-between text-gray-500">
                    <h3 className="text-xs font-thin text-gray-800 flex gap-1 items-center leading-snug">
                        <BookOpenText className="w-4 h-4 text-indigo-500 shrink-0 self-start mt-[2px]" />
                        <span className="break-words dark:text-gray-300">{name}</span>
                    </h3>

                    <span className="flex gap-2 text-xs dark:text-gray-300"><GraduationCap className="w-4 h-4 text-indigo-500" />{author}</span>
                </div>
            </div>
            <div className="flex justify-center px-1 h-24">
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
            </div>
            <div className="flex justify-center p-3">
                {enrollment && <button className="bg-[#3f3f3f] rounded-lg text-white p-2 font-semibold hover:" onClick={handleStartLearning} >Learn</button>}

            </div>



        </div>
    );
}

export default Course;
