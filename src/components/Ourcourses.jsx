import React, { useState, useEffect } from 'react';
import Course from '../components/Course';
import axiosInstance from '../api/axiosInstance';
import Courseloading from '../components/loading/Courseloading';
import { useLearn } from "./context/ContextProvider";


function Ourcourses({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const image_url = "https://i.pinimg.com/736x/4e/cd/36/4ecd362ba981ba27ed688f65c18b9ffa.jpg";
  const { courseData, setCourseData } = useLearn();



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        if (!courseData) {
          const response = await axiosInstance.get("/all_courses");
          setCourseData(response.data);
          setCourses(response.data)
          console.log(response.status)
        } else {
          setCourses(courseData || []);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [courseData, setCourseData]);

  const filteredCourses = courses.filter((course) => {
    const courseName = course.name ? course.name.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    const query = searchQuery ? searchQuery.toLowerCase() : "";
    return courseName.includes(query) || description.includes(query);
  });

  const displayCourses = searchQuery ? filteredCourses : courses;

  return (
    <div className="text-[#840227] dark:text-gray-400 bg-white h-auto mx-auto shadow-2xl rounded-lg sm:p-5 dark:bg-slate-700">
      <h1 className='text-3xl md:text-4xl lg:text-5xl ml-6 pt-5 sm:pt-0 sm:ml-0 font-bold'>Our Courses</h1>

      {loading ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-10 p-5 justify-center items-center'>
          {Array.from({ length: 12 }).map((_, index) => (
            <Courseloading key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : displayCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-4 p-5 sm:p-2 justify-center items-center">
          {displayCourses.map((course, index) => (
            <Course
              key={index}
              url={image_url}
              name={course.name}
              description={course.description}
              author={course.author}
              enrollment={course.enrollment}
              locked={course.locked}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          No courses found{searchQuery && ` for “${searchQuery}”`}
        </p>
      )}
    </div>
  );
}

export default Ourcourses;
