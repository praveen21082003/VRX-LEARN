import React, { useRef, useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Expand, Minimize } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useLearn } from "./context/ContextProvider";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

function PdfViewer({ fileId }) {
  const {
    numPages, setNumPages,
    pageNumber, setPageNumber,
    scale, setScale,
    pdfBlobUrl, setPdfBlobUrl,
    loading, setLoading
  } = useLearn();

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const pageRefs = useRef([]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pageWidth, setPageWidth] = useState(300);

  /* ----------------------------------------
     FETCH PDF
  ------------------------------------------ */
  useEffect(() => {
    const fetchPDF = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/media/pdf/${fileId}`, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (err) {
        console.error("PDF Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) fetchPDF();
  }, [fileId]);

  /* ----------------------------------------
     GET PARENT WIDTH  
  ------------------------------------------ */
  useEffect(() => {
    if (!containerRef.current) return;

    const observe = () => {
      setPageWidth(containerRef.current.clientWidth - 20);
    };

    observe();
    window.addEventListener("resize", observe);
    return () => window.removeEventListener("resize", observe);
  }, []);

  /* ----------------------------------------
     FULLSCREEN HANDLER
  ------------------------------------------ */
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  /* ----------------------------------------
     ZOOM CONTROLS
  ------------------------------------------ */
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(1);

  /* ----------------------------------------
     PAGE SCROLL DETECTION
  ------------------------------------------ */
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handler = () => {
      const midpoint = scrollEl.scrollTop + scrollEl.clientHeight / 2;

      for (let i = 0; i < numPages; i++) {
        const el = pageRefs.current[i];
        if (!el) continue;

        const top = el.offsetTop;
        const bottom = top + el.clientHeight;

        if (midpoint >= top && midpoint <= bottom) {
          setPageNumber(i + 1);
          break;
        }
      }
    };

    scrollEl.addEventListener("scroll", handler);
    return () => scrollEl.removeEventListener("scroll", handler);
  }, [numPages]);

  /* ----------------------------------------
     PAGE NUMBER CHANGE (input)
  ------------------------------------------ */
  const onPageChange = (e) => {
    let val = Number(e.target.value);
    if (val < 1 || val > numPages) return;
    setPageNumber(val);

    pageRefs.current[val - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ----------------------------------------
     EFFECTIVE PAGE WIDTH (safe)
  ------------------------------------------ */
  const effectiveWidth = pageWidth * scale;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col bg-[#00000010] rounded-lg overflow-hidden"
    >

      {/* ----------- TOP CONTROLS ----------- */}
      <div className="w-full flex justify-between items-center bg-black/40 text-white py-2 px-3">
        {/* ZOOM */}
        <div className="flex gap-2 items-center">
          <button onClick={zoomOut} className="p-2 bg-white/10 rounded-full">
            <ZoomOut size={20} />
          </button>
          <span className="text-sm">
            {(scale * 100).toFixed(0)}%
          </span>
          <button onClick={zoomIn} className="p-2 bg-white/10 rounded-full">
            <ZoomIn size={20} />
          </button>
          <button onClick={resetZoom} className="px-3 bg-gray-300 text-black rounded-md">
            Reset
          </button>
        </div>

        {/* PAGE NAVIGATION */}
        <div className="flex items-center gap-1">
          <span>Page</span>
          <input
            type="number"
            value={pageNumber}
            onChange={onPageChange}
            className="w-10 text-center text-black rounded"
          />
          <span> of {numPages}</span>

          {/* FULLSCREEN */}
          <button
            onClick={toggleFullscreen}
            className="ml-4 p-2 bg-white/10 rounded-full"
          >
            {isFullScreen ? <Minimize /> : <Expand />}
          </button>
        </div>
      </div>

      {/* ----------- PDF SCROLL AREA ----------- */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-auto flex flex-col items-center py-3"
      >
        {loading && (
          <p className="text-center text-gray-300">Loading PDF...</p>
        )}

        {pdfBlobUrl && (
          <Document
            file={pdfBlobUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from({ length: numPages }, (_, idx) => (
              <div
                key={idx}
                ref={(el) => (pageRefs.current[idx] = el)}
                className={`mb-4 shadow-lg rounded-md ${
                  pageNumber === idx + 1 ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <Page
                  pageNumber={idx + 1}
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
