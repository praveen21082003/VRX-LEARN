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
import Coursecontentloading from "../components/loading/Coursecontentloading";

function LearnPage({ user }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [openModules, setOpenModules] = useState({});
  const [data, setData] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentPDF, setCurrentPDF] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
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
        setShowWarning(true);
        e.preventDefault();
        navigate("/logout");
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

  const handlePlayNextVideo = () => {
    if (!activeVideo) return;

    const videoItems = data.filter(item => item.resource_type === "video");
    const currentIndex = videoItems.findIndex(
      item => item.file_id === activeVideo
    );

    if (currentIndex === -1 || currentIndex === videoItems.length - 1) {
      return;
    }

    const nextVideoId = videoItems[currentIndex + 1].file_id;
    handleVideoPlay(nextVideoId);
  };

  return (
    <>
      {showWarning && (
        <WarningPopup
          message="⚠️ Screenshots are not allowed! You will be redirected."
          show={true}
          onClose={() => setShowWarning(false)}
        />
      )}

      {errorData.show && (
        <DialogueBox
          errorCode={errorData.code}
          errorMessage={errorData.message}
          error={errorData.detail}
          onClose={() => {
            setErrorData(prev => ({ ...prev, show: false }));
            navigate(-1);
          }}
        />
      )}

      <div
        className="
      noselect 
      w-full h-full 
      flex flex-col      /* mobile stacked */
      md:flex-row        /* medium & large = side-by-side */
      bg-gray-50 dark:bg-gray-900 
      rounded-lg shadow-lg
    "
      >

        {/* SIDEBAR — 60% on md/lg */}
        {loading ? (
          <Coursecontentloading />
        ) : (
          <div
            className="
          w-full          /* mobile = full width */
          md:w-[45%]      /* medium screens = 60% */
          lg:w-[30%]      /* large screens = 60% */
          h-auto md:h-full
          overflow-y-auto
          border-r border-gray-300 dark:border-gray-700
          p-4
        "
          >
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Learn
            </h1>

            {Object.entries(groupedData).map(([courseName, modules], idx) => (
              <div key={idx} className="mb-5">

                <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {courseName}
                </h2>

                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y">
                  {Object.entries(modules).map(([moduleName, resources], i) => {
                    const moduleKey = `${courseName}-${moduleName}`;
                    const isModuleOpen = openModules[moduleKey];

                    return (
                      <div key={i} className="p-2">
                        <h3
                          className="text-md font-medium text-[#840227] mb-2 flex items-center justify-between cursor-pointer dark:text-gray-400"
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
                                  className={`
                                flex justify-between items-center 
                                px-2 py-2 text-sm rounded 
                                transition-all 
                                ${isActive
                                      ? "bg-red-50 dark:bg-[#1F2937] text-red-600 shadow-sm"
                                      : "bg-white dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                                    }
                              `}
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
                                  <span className="truncate dark:text-gray-300">
                                    {res.resource_name}
                                  </span>

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
              </div>
            ))}
          </div>
        )}

        {/* VIEWER */}
        <div
          className="
        w-full        
        md:w-[70%]        
        lg:w-[70%]       
        h-[40%] md:h-full
        md:px-2 py-3
        flex flex-col gap-4 items-center justify-center
      "
        >
          {currentPDF ? (
            <PdfViewer fileId={currentPDF} />
          ) : currentVideo ? (
            <Video
              videoRef={videoRef}
              video_URL={currentVideo}
              user={user}
              onNextVideo={handlePlayNextVideo}
            />
          ) : (
            <p className="text-gray-500 flex gap-3 items-center">
              <MousePointerClick className="w-5 h-5" />
              Welcome to the training panel. Select a Video or PDF.
            </p>
          )}
        </div>

      </div>
    </>

  );
}

export default LearnPage;




