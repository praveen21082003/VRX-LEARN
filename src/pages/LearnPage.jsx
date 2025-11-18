import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  BookOpen,
  MonitorPlay,
  MonitorPause,
  MousePointerClick,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import Video from "../components/Video";
import PdfViewer from "../components/PdfViewer";
import { useLearn } from "../components/context/ContextProvider";
import DialogueBox from "../components/DialogueBox";

function LearnPage({ user }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [openCourses, setOpenCourses] = useState({});
  const [openModules, setOpenModules] = useState({});
  const [data, setData] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentPDF, setCurrentPDF] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState({
    code: null,
    message: "",
    detail: "",
    show: false
  });

  const [learnData, setLearnData] = useState({});
  const { course_id } = useParams();

  useEffect(() => {
    setLoading(true);

    if (learnData[course_id]) {
      setData(learnData[course_id]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/course_materials/${course_id}`);

        setLearnData(prev => ({
          ...prev,
          [course_id]: res.data     // cache per course
        }));

        setData(res.data);
      } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.detail || "Unexpected error";

        setErrorData({
          code: status,
          message: "Request failed",
          detail: detail,
          show: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [course_id, learnData, setLearnData]);

  const isBingApp = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("bing") || ua.includes("edga") || ua.includes("webview");
  };


  useEffect(() => {
    if (isBingApp()) {
      alert("⚠️ Some features like fullscreen landscape mode may not work in the Bing App. For best experience, please open the site in Chrome or Edge Browser.");
    }
  }, []);




  useEffect(() => {
    const allowedKeys = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "m"];
    const handleKeyDown = (e) => {
      if (allowedKeys.includes(e.key)) return;
      const isBlockedShortcut =
        (e.ctrlKey && e.key.toLowerCase() === "s") ||
        (e.ctrlKey && e.key.toLowerCase() === "p") ||
        (e.ctrlKey && e.key.toLowerCase() === "c") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        e.key === "F12";
      if (isBlockedShortcut) {
        e.preventDefault();
        alert("This action is disabled!");
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen" || (e.ctrlKey && e.shiftKey && e.key === "i")) {
        e.preventDefault();
        navigate("/");
      }
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("This action is disabled!");
    };


    const disableSelect = (e) => {
      e.preventDefault();
    }


    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", disableSelect);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", disableSelect);
    };
  }, [navigate]);


  const groupedData = data.reduce((acc, item) => {
    const { course_name, module_name } = item;
    if (!acc[course_name]) acc[course_name] = {};
    if (!acc[course_name][module_name]) acc[course_name][module_name] = [];
    acc[course_name][module_name].push(item);
    return acc;
  }, {});

  const toggleCourse = (courseName) => {
    setOpenCourses((prev) => ({
      ...prev,
      [courseName]: !prev[courseName],
    }));
  };

  const toggleModule = (moduleKey) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const handleVideoPlay = (resourcePath) => {
    const baseVideoURL = `${axiosInstance.defaults.baseURL}/media/video/`;
    const fullVideoURL = `${baseVideoURL}${resourcePath}`;

    setCurrentPDF("");
    setActiveVideo(resourcePath);
    setCurrentVideo(fullVideoURL);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = fullVideoURL;
      videoRef.current.load();
      videoRef.current.play().catch(() => { });
    }
  };

  return (
    <>
      {
        loading && (
          <div className="h-full w-full flex justify-center items-center">
            <p>Loading course content...</p>
          </div>
        )
      }
      {
        errorData.show && (
          <DialogueBox
            errorCode={errorData.code}
            errorMessage={errorData.message}
            error={errorData.detail}
            onClose={() => {
              setErrorData(prev => ({ ...prev, show: false }));
              navigate(-1);
            }}
          />
        )
      }
      < div className="noselect h-full w-full flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg" >
        {/* Sidebar */}
        < div className="h-[60%] sm:h-auto overflow-y-scroll sm:overflow-y-auto w-full md:w-[35%] lg:w-[30%] border-r-2 border-gray-200 dark:border-gray-700 p-4" >

          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> Learn
          </h1>

          {
            Object.entries(groupedData).map(([courseName, modules], idx) => {
              const isCourseOpen = openCourses[courseName];
              return (
                <div key={idx} className="mb-5">

                  <h2
                    className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleCourse(courseName)}
                  >
                    {courseName}
                    {isCourseOpen ? <ChevronUp /> : <ChevronDown />}
                  </h2>

                  {isCourseOpen && (
                    <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y">

                      {Object.entries(modules).map(([moduleName, resources], i) => {
                        const moduleKey = `${courseName}-${moduleName}`;
                        const isModuleOpen = openModules[moduleKey];

                        return (
                          <div key={i} className="p-2">

                            <h3
                              className="text-md font-medium text-[#840227] mb-2 flex items-center justify-between cursor-pointer dark:text-gray-500"
                              onClick={() => toggleModule(moduleKey)}
                            >
                              {moduleName}
                              {isModuleOpen ? <ChevronUp /> : <ChevronDown />}
                            </h3>

                            {isModuleOpen && (
                              <div className="pl-2">
                                {resources.map((res, j) => {
                                  const isActive = activeVideo === res.file_id;
                                  const isPDF = res.resource_type === "pdf";

                                  return (
                                    <div
                                      key={j}
                                      className={`flex justify-between items-center px-2 py-2 text-sm rounded transition-all ${isActive
                                        ? "bg-red-50 dark:bg-[#1F2937] text-red-600 shadow-sm"
                                        : "bg-white dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                                        }`}
                                      onClick={() => {
                                        if (isPDF) {
                                          setCurrentPDF(res.file_id);
                                          setCurrentVideo("");
                                          return;
                                        }

                                        setCurrentPDF("");
                                        handleVideoPlay(res.file_id);
                                      }}
                                    >
                                      <span className="truncate dark:text-gray-300">{res.resource_name}</span>

                                      {isPDF ? (
                                        <span className="text-blue-600 font-bold">PDF</span>
                                      ) : isActive ? (
                                        <MonitorPause className="text-green-800 w-4 h-4" />
                                      ) : (
                                        <MonitorPlay className="text-gray-500 w-4 h-4" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>
              );
            })
          }

        </div >

        {/* Viewer Section */}
        < div className="w-full h-[30%] sm:h-full md:px-10 sm:flex items-center justify-center" >

          {
            currentPDF ? (
              <PdfViewer fileId={currentPDF} />

            ) : currentVideo ? (
              <Video videoRef={videoRef} video_URL={currentVideo} user={user} />
            ) : (
              <p className="text-gray-500 flex gap-3 items-center">
                <MousePointerClick className="w-5 h-5" />
                Welcome to the training panel. Select a Video or PDF.
              </p>
            )
          }

        </div >

      </div >
    </>
  );
}

export default LearnPage;
