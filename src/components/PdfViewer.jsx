import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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

  const pdfCache = useRef(new Map());


  /* ----------------------------------------
     FETCH PDF
  ------------------------------------------ */
  useEffect(() => {


    if (!fileId) return;


    if (pdfCache.current.has(fileId)) {
      setPdfBlobUrl(pdfCache.current.get(fileId));
      return;
    }

    const fetchPDF = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/media/pdf/${fileId}`, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        pdfCache.current.set(fileId, url);
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

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setPageWidth(containerRef.current.clientWidth - 20);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setScale(1);


  /* ---------------------------------------
    SIDE HIDING ON ZOOM 
  ------------------------------------------ */
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    // Keep left edge visible
    scrollEl.scrollLeft = 0;
  }, [scale, pageWidth]);


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



  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center flex-col bg-[#00000010] rounded-lg overflow-hidden"
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
        className={`w-full h-full overflow-auto ${(scale < 1) && "items-center"} flex flex-col py-3`}
      >
        {pdfBlobUrl && (
          <Document
            file={pdfBlobUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from({ length: numPages }, (_, idx) => (
              <div
                key={idx}
                ref={(el) => (pageRefs.current[idx] = el)}
                className={`mb-4 shadow-lg ${scale === 1 ? "mx-auto" : "ml-0"
                  }`}
              >
                <Page
                  pageNumber={idx + 1}
                  width={pageWidth * scale}
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
