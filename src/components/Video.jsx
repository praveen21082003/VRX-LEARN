import React, { use, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Timer,
  Loader,
  CirclePlay,
  MoveRight
} from "lucide-react";
import Watermark from "./Watermark";

function ModuleVideo({ videoRef, video_URL, onExitFullScreen, user, onNextVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);
  const [showVolumeUI, setShowVolumeUI] = useState(false);


  const containerRef = useRef(null);
  const hideTimeout = useRef(null);


  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={22} />;
    if (volume > 0.7) return <Volume2 size={22} />;
    if (volume > 0.3) return <Volume1 size={22} />;
    return <Volume size={22} />
  };

  /** Reset state on URL change */
  useEffect(() => {
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
    setError("");
  }, [video_URL]);

  /** Handles progress, duration, mouse move (controls hide/show), and key events */
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video) return;

    // Update progress and time
    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    // Set duration
    const setVideoDuration = () => setDuration(video.duration || 0);

    // Hide controls on inactivity
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setShowControls(false), 4000);
    };


    // Tab shift pause video 
    const handleVisibilityChange = () => {
      if (document.hidden && !video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    };


    // When browser window closed (pasused)

    const handleWindowBlur = () => {
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    };


    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (!video) return;
      if (e.key === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 10);
      }

      else if (e.key === "ArrowRight") {
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
      }

      else if (e.key === "ArrowUp") {
        const newVolume = Math.min(1, (video.volume || 0) + 0.1);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);

        setShowVolumeUI(true);
        setTimeout(() => setShowVolumeUI(false), 1200);
      }

      else if (e.key === "ArrowDown") {
        const newVolume = Math.max(0, (video.volume || 0) - 0.1);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);

        setShowVolumeUI(true);
        setTimeout(() => setShowVolumeUI(false), 1200);
      }

      else if (e.key === " ") {
        e.preventDefault();
        handlePlayPause();
      }

      else if (e.key === "m") {
        e.preventDefault();
        handleMute();
      }

      else if (e.key === "f") {
        handleFullScreen();
      }
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setVideoDuration);
    container?.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      container?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(hideTimeout.current);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [videoRef, video_URL, isPlaying]);

  /** Fullscreen management (desktop + mobile landscape) */
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isNowFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isNowFullScreen);

      if (!isNowFullScreen && typeof onExitFullScreen === "function") {
        onExitFullScreen();
      }

      // Mobile orientation lock

      if (isNowFullScreen && window.innerWidth < 768) {
        screen.orientation?.lock?.("landscape").catch(() => { });
      } else {
        screen.orientation?.unlock?.();
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [onExitFullScreen]);

  /** Auto fullscreen on mobile */
  useEffect(() => {
    if (video_URL && window.innerWidth < 768) {
      setTimeout(() => {
        if (!document.fullscreenElement && containerRef.current) {
          containerRef.current.requestFullscreen().catch(() => { });
        }
      }, 500);
    }
  }, [video_URL]);



  /** Controls */
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleSpeedChange = () => {
    const newSpeed = speed >= 2 ? 0.5 : speed + 0.5;
    const video = videoRef.current;
    if (video) video.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  /** 🔹 Handle playback errors */
  const handleVideoError = (e) => {
    const errorCode = e.target.error?.code;
    const messages = {
      1: "Video playback aborted.",
      2: "Network error occurred while fetching video.",
      3: "Video decoding failed or unsupported format.",
      4: "Video source not found or inaccessible.",
    };
    setError(messages[errorCode] || "An unknown error occurred while loading the video.");
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex justify-center overflow-hidden"
      >
        {/* Video element */}
        {video_URL && (
          <video
            ref={videoRef}
            key={video_URL}
            src={video_URL}
            className="rounded-lg object-contain w-full h-full"
            controls={false}
            disablePictureInPicture
            onEnded={() => {
              setIsPlaying(!isPlaying)
            }}
            onLoadStart={() => setWaiting(true)}
            onCanPlay={() => setWaiting(false)}
            onPlaying={() => setWaiting(false)}
            onWaiting={() => setWaiting(true)}
            onError={handleVideoError}
          />
        )}

        {/* Loading overlay */}
        {waiting && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
            <Loader className="animate-spin text-white w-10 h-10" />
            <p className="text-white ml-2">Loading...</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg z-50">
            <p className="text-red-400 font-semibold text-sm px-6 text-center">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Watermark */}
        <div className="watermark absolute mt-16 h-[90%] w-[80%]">
          <Watermark user={user} />
        </div>

        {/* Controls */}
        {!waiting && !error && (
          <>
            <img
              src="/logo.png"
              alt="logo"
              className="absolute top-4 right-4 w-8 bg-white p-1 rounded-sm opacity-80"
            />

            <div
              onClick={handlePlayPause}
              className={`
              absolute inset-0 flex justify-center items-center 
              transition-opacity duration-300 
              ${showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
            >
              {!isPlaying && (
                <div className={`
              bg-black/10
              text-white flex justify-center items-center
              rounded-full shadow-sm
              p-5 sm:p-7 cursor-pointer
              active:scale-95
              transition-all duration-300
              ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}>
                  <Play size={30} className="drop-shadow-md" />
                </div>
              )}
            </div>

            {showVolumeUI && (
              <div
                className="
              absolute
              bg-black/10 
              text-white flex justify-center items-center
              rounded-full shadow-sm
              p-5 sm:p-7 cursor-pointer
              active:scale-95
              transition-all duration-300
            "
              >
                {getVolumeIcon()}
              </div>
            )}




            <div
              className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent rounded-b-lg px-1 sm:px-4 py-3 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 accent-white cursor-pointer hover:h-[6px]"
              />

              <div className="flex justify-between px-1 sm:px-5 items-center text-white">
                {/* Left controls */}
                <div className="flex items-center">
                  <button
                    onClick={handlePlayPause}
                    className="bg-black h-8 w-8 sm:h-10 sm:w-10 flex justify-center items-center rounded-full z-50"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="ml-[-5px] text-xs sm:text-sm bg-black px-2 py-[3px] sm:py-1 rounded-r-full opacity-70 z-40">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex gap-5 bg-black px-4 py-1 rounded-full opacity-80 items-center">
                  <img
                    src="/VRNEXGEN-01.png"
                    alt="brand"
                    className="w-8 sm:w-12 bg-white rounded-sm p-1"
                  />
                  <button onClick={handleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button onClick={handleFullScreen}>
                    {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                  <button onClick={handleSpeedChange} className="flex items-center gap-1">
                    <Timer size={18} />
                    <span className="text-sm">{speed}x</span>
                  </button>
                </div>
              </div>
            </div>
          </>

        )}
      </div>

      <div className="h-5">
        {progress > 99 &&
          <button className="bg-green-700 flex justify-center md:gap-1 items-center text-xs lg:text-base text-white px-4 py-1 md:px-4 md:py-2 rounded-lg" onClick={onNextVideo}><CirclePlay size={20} />Next<MoveRight size={15} /></button>}
      </div>
    </>
  );
}

export default ModuleVideo;
