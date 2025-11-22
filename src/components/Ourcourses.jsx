import React, { useState, useEffect, use } from 'react';
import Course from '../components/Course';
import axiosInstance from '../api/axiosInstance';
import Courseloading from '../components/loading/Courseloading';
import { useLearn } from "./context/ContextProvider";
import { useParams, useNavigate, replace } from 'react-router-dom';


function Ourcourses() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const image_url = "https://i.pinimg.com/736x/4e/cd/36/4ecd362ba981ba27ed688f65c18b9ffa.jpg";
  const { courseData, setCourseData } = useLearn();
  const navigate = useNavigate();

  const searchQuery = useParams();
  console.log(searchQuery)



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        if (!courseData) {
          const response = await axiosInstance.get("/all_courses");
          setCourseData(response.data);
          setCourses(response.data);
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
    const query = searchQuery.id ? searchQuery.id.toLowerCase() : "";
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-4 p-5 sm:p-2 justify-center items-center">

          {/* CASE 1: courses found */}
          {displayCourses.length > 0 ? (
            displayCourses.map((course, index) => (
              <Course
                key={index}
                url={image_url}
                name={course.name}
                description={course.description}
                author={course.author}
                enrollment={course.enrollment}
                locked={course.locked}
              />
            ))
          ) : (
            /* CASE 2: NO courses found (show message) */
            <div className="col-span-full flex flex-col items-center">
              <p className="text-center text-gray-500 py-10">
                No courses found for “{searchQuery.id}”
              </p>
            </div>
          )}

          {/* ALWAYS SHOW VIEW ALL IF SEARCH IS ACTIVE */}
          {searchQuery.id && (
            <div
              className="
          bg-slate-100 hover:bg-white rounded-lg shadow-md 
          h-full min-h-[260px]
          flex items-center justify-center
          dark:bg-[#0A0A0A]
          transition-all duration-300
          hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]
          cursor-pointer col-span-1
        "
              onClick={() => navigate("/courses", { replace: true })}
            >
              <p className="text-lg font-semibold text-[#840227] dark:text-indigo-400">
                View All Courses →
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Ourcourses;
