import React, { useRef, useState, useEffect } from 'react'
import { useLearn } from './context/ContextProvider';
import { ZoomIn, ZoomOut, Expand, Minimize } from "lucide-react";
import { pdfjs, Document, Page } from 'react-pdf';
import axiosInstance from "../api/axiosInstance";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";

function PdfViewer({ fileId }) {

  const {
    numPages, setNumPages,
    pageNumber, setPageNumber,
    scale, setScale,
    pdfBlobUrl, setPdfBlobUrl,
    loading, setLoading,
  } = useLearn();

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const pageRefs = useRef([]);

  const [pageWidth, setPageWidth] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const dynamicMargin = Math.max(0, (scale - 1) * 900);


  // -------- FULLSCREEN ----------
  const handleFullScreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen()
        .then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false));
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  // -------- CONTAINER WIDTH ----------
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // -------- ZOOM ----------
  const zoomIn = () => {setScale(prev => Math.min(prev + 0.2, 2))};
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.2));
  const resetZoom = () => setScale(1);

  // -------- LOAD PDF ----------
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (pageNumber > numPages) setPageNumber(1);
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/media/pdf/${fileId}`,
          { responseType: "arraybuffer" }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        setPdfBlobUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) fetchPdf();
  }, [fileId]);

  
  // -------- PAGE DETECTION (works in ANY zoom) ----------
  // Use a ref to track if the scroll was initiated by a page jump
  const isJumping = useRef(false);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !numPages) return;

    let timeout = null;

    const handleScroll = () => {
      // If a jump was just initiated, ignore the scroll event for a brief period
      if (isJumping.current) {
        return;
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollTop = scrollEl.scrollTop;
        const middle = scrollTop + scrollEl.clientHeight / 2;

        for (let i = 0; i < numPages; i++) {
          const el = pageRefs.current[i];
          // Ensure element exists and is visible (or at least has offset info)
          if (!el || el.offsetHeight === 0) continue;

          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;

          if (middle >= top && middle <= bottom) {
            if (pageNumber !== i + 1) {
              setPageNumber(i + 1);
            }
            break;
          }
        }
      }, 100); // Increased debounce time for better performance and stability
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [numPages, setPageNumber]); 

  // ... (existing code up to handlePageInputChange)

  // -------- PAGE JUMP ----------
  const handlePageInputChange = (e) => {
    const val = Number(e.target.value);
    if (!val || val < 1 || val > numPages) return;

   
    setPageNumber(val);

    
    isJumping.current = true;

    
    pageRefs.current[val - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    
    setTimeout(() => {
      isJumping.current = false;
    }, 200); 
  };



  // -------- EFFECTIVE WIDTH ----------
  const effectiveWidth = pageWidth
    ? Math.max(pageWidth * scale, 320)
    : 320;

  // -------- PINCH TO ZOOM SUPPORT (native + extra option) ----------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;


    el.style.touchAction = "pan-y pinch-zoom";

    return () => {
      el.style.touchAction = "auto";
    }
  }, []);

  return (
    <div ref={containerRef} className="sm:fixed w-full h-full sm:h-[90%] sm:w-[60%]">

      {/* Toolbar */}
      <div className="flex justify-between items-center p-1 bg-black/40 text-white rounded-t-xl border border-white/10 sm:h-[10%]">
        <div className="flex sm:gap-3 items-center">
          <button onClick={zoomOut} className="p-1 bg-white/10 rounded-full"><ZoomOut size={20} /></button>
          <span className="text-sm">Zoom: {(scale * 100).toFixed(0)}%</span>
          <button onClick={zoomIn} className="p-1 bg-white/10 rounded-full"><ZoomIn size={20} /></button>
          <button onClick={resetZoom} className="px-3 py-1 bg-gray-300 text-black rounded-md">Reset</button>
        </div>

        <div className="flex items-center gap-1">
          <span>Page</span>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInputChange}
            className="w-5 text-center text-black rounded"
          />
          <span>of {numPages}</span>

          <button onClick={handleFullScreen} className="ml-4 p-1 bg-white/10 rounded-full">
            {isFullScreen ? <Minimize size={15} /> : <Expand size={15} />}
          </button>
        </div>
      </div>

      {/* Scroll Area */}
      <div
        ref={scrollRef}
        className="flex justify-center w-full h-full sm:h-[90%] bg-black/10 overflow-auto"
      >
        {loading && (
          <div className="flex items-center justify-center h-full text-white">
            Loading PDF...
          </div>
        )}

        {pdfBlobUrl && (
          <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <div
                key={i}
                ref={(el) => (pageRefs.current[i] = el)}
                style={{ marginLeft: dynamicMargin }}
                className={`mb-3 flex justify-center ${pageNumber === i + 1 ? "ring-2 ring-indigo-500" : ""} overflow-auto`}
              >
                <Page
                  pageNumber={i + 1}
                  width={effectiveWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
