import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Course from '../components/Course';
import axiosInstance from '../api/axiosInstance';
import Courseloading from '../components/loading/Courseloading';
import { useLearn } from "./context/ContextProvider";
import DialogueBox from './DialogueBox';

function MyCourses({ searchQuery }) {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [errorData, setErrorData] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });
    const image_url = "https://i.pinimg.com/1200x/aa/fe/c1/aafec1ee67e230a77f89463e421b006b.jpg";
    const { myCourseData, setMyCourseData } = useLearn();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                if (!myCourseData) {
                    const response = await axiosInstance.get("/my_courses");
                    setMyCourseData(response.data);
                    setCourses(response.data)
                } else {
                    setCourses(myCourseData || []);
                }
            } catch (err) {
                const status = err.response?.status;
                const detail = err.response?.data?.detail

                setErrorData({
                    code: status,
                    message: "Request failed",
                    detail: detail,
                    show: true
                })
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [myCourseData, setMyCourseData]);

    const filteredCourses = courses.filter((course) => {
        const courseName = course.name ? course.name.toLowerCase() : "";
        const description = course.description ? course.description.toLowerCase() : "";
        const query = searchQuery ? searchQuery.toLowerCase() : "";
        return courseName.includes(query) || description.includes(query);
    });

    const displayCourses = searchQuery ? filteredCourses : courses;
    return (
        <div className="text-[#840227] dark:text-gray-400 bg-white h-auto mx-auto shadow-2xl rounded-lg sm:p-5 dark:bg-slate-700 mt-5">
            <h1 className='text-3xl md:text-4xl lg:text-5xl ml-6 sm:ml-0 pt-5 sm:pt-0 font-bold'>Enrolled Courses</h1>

            {loading ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-10 p-5 justify-center items-center'>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Courseloading key={index} />
                    ))}
                </div>
            ) : errorData.show ? (
                <DialogueBox
                    errorCode={errorData.code}
                    errorMessage={errorData.message}
                    error={errorData.detail}
                    onClose={() => {
                        setErrorData(prev => ({ ...prev, show: false }));
                        navigate(-1);
                    }}
                />
            ) : displayCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-4 p-5 sm:p-2 justify-center items-center">
                    
                    {displayCourses.map((course, index) => (
                        <Course
                            key={index}
                            id={course.id}
                            url={image_url}
                            name={course.name}
                            description={course.description}
                            author={course.author}
                            enrollment={true}
                            locked={course.locked}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">
                    No enrolled courses found{searchQuery && ` for “${searchQuery}”`}
                </p>
            )}
        </div>
    )
}

export default MyCourses
