import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, User, CornerDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import MyCourses from "../components/MyCourses";
import Footer from "../components/Footer";
import DailyQuote from "../components/DailyQuot";
import Userprofile from "../components/Userprofile";
// import Ourcourses from "../components/Ourcourses";

const Dashboard = forwardRef(({ user, error }, ref) => {
  const [count, setCount] = useState(5);
  const [dots, setDots] = useState("");
  // const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setsearchQuery] = useState("");
  const navigate = useNavigate();
  const coursesRef = useRef(null);


  // Redirect countdown when error occurs
  useEffect(() => {
    if (error.show && count > 0) {
      const timer = setInterval(() => {
        setCount(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    else if (error.show && count === 0) {
      navigate("/");
    }
  }, [error, count, navigate]);


  // Dots animation (once)
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (coursesRef.current) {
        coursesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }


  const handleStartLearning = () => {
    const courseId = sessionStorage.getItem("fromLearnButton");
    if (courseId) {
      navigate(`/learn/${courseId}`);
    }
  }

  // ---------- Error ----------
  if (error.show) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center">
        <h2 className="text-red-500 font-semibold">⚠️ {error.message}</h2>

        <p className="text-gray-500 mt-2">Error Code: {error.code}</p>

        <p className="text-gray-400 mt-2">{error.detail}</p>

        <br />

        <div className="flex gap-4 w-full justify-center items-center">
          <h2 className="text-red-500">
            Page will redirect to login in
          </h2>
          <span className="text-2xl font-bold text-red-600 w-5">{dots}</span>
          <span className="text-2xl font-bold text-red-600 animate-pulse">
            {count}
          </span>
        </div>
      </div>
    );
  }

  // ---------- Main Dashboard ----------
  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full">
        {/* Search Bar */}
        <div className="relative w-[63%] sm:w-[50%] md:w-[56%] text-[10px] sm:text-sm" onKeyDown={handleKeyPress}>
          <Search className="absolute scale-50 sm:scale-100 left-1 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search (e.g., Python, Mainframe, etc.)"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
            className="w-full text-[10px] sm:text-sm pl-5 sm:pl-10 pr-2 py-2 border rounded-md outline-none 
                      focus:ring-2 focus:ring-indigo-100 dark:bg-[#0A0A0A] dark:focus:ring-gray-600 dark:border-gray-700 dark:text-slate-300"
          />
          <div className="flex text-sm absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <p className="hidden md:block">Press Enter</p>
            <CornerDownLeft className="scale-50 sm:scale-75 ml-1" />
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex w-[30%] sm:w-[25%] md:w-[20%] justify-end items-center">
          <Userprofile user={user} />
        </div>
    

      {/* <div className="flex sm:gap-10 items-center">
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-0 hover:dark:bg-[#1F2937]"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
            >
              <Bell className="text-gray-700 text-2xl hover:dark:text-black" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-0 bg-red-500"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 dark:bg-[#1a1818]">
                <div className="py-1">
                  <p className="block px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                    Notifications (3 New)
                  </p>
                  <div className="px-4 py-3 text-sm text-gray-500">
                    <p>Your notifications will appear here!</p>
                    <p
                      className="text-xs mt-2 text-indigo-500 cursor-pointer hover:underline"
                      onClick={() => navigate("/inbox")}
                    >
                      View All
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}
    </div >

      {/* Welcome Section */ }
      < div className = "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between text-white mt-5 w-full dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-gray-400" >
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Welcome to Your Learning Journey!
          </h1>
          <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6">
            Embark on an exciting adventure of knowledge. Explore courses, track your progress, and achieve your academic goals with ease.
          </p>
          <button
            className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 dark:bg-[#4e4d4d] hover:dark:bg-[#1F2937] dark:text-gray-400"
            onClick={handleStartLearning}
          >
            Continue Learning
          </button>

        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cover bg-center rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              src="/welcome.mp4"
              className="absolute inset-0 w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div >

  {/* Courses Section */ }
  < div ref = { coursesRef } >
    <div ref={ref}>
      <MyCourses searchQuery={searchQuery} />
    </div>
{/* <Ourcourses searchQuery={searchQuery} /> */ }
      </div >



  {/* Closing Section */ }
  < div className = "bg-[#840227] rounded-lg shadow-xl flex justify-center flex-col lg:flex-row text-white my-8 gap-20" >
        <div className="flex justify-center lg:w-[40%]">
          <img
            src="/images/image3.jpg"
            alt="Young woman holding books"
            className="h-96 w-auto lg:ml-10 mt-0 rounded-b-full shadow-lg"
          />

        </div>

        <div className="text-center lg:text-left md:p-10 lg:p-16 lg:w-[70%]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Unlock Your Potential
          </h1>
          <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6">
            Learning is the first step to transforming your future. At VRNexGen, our courses are more than lessons — they are pathways to innovation, growth, and success.
          </p>
          <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6">
            With every skill you gain, you’re not just learning; you’re building the confidence to shape the career you dream of.
          </p>
          <DailyQuote />
        </div>
      </div >

  <Footer />
    </>
  );
});

export default Dashboard;
