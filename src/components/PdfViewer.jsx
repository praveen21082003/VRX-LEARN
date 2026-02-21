import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, Expand, Minimize, ChevronRight, ChevronLeft } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useLearn } from "./context/ContextProvider";
import PdfLoading from "./loading/PdfLoading";
import DialogueBox from "./DialogueBox";


// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.disableFontFace = true;


pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

function PdfViewer({ fileId }) {
  const [error, setError] = useState({
    code: null,
    message: "",
    detail: "",
    show: false
  });

  const {
    numPages, setNumPages,
    pageNumber, setPageNumber,
    scale, setScale,
    pdfBlobUrl, setPdfBlobUrl,
  } = useLearn();

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const pageRefs = useRef([]);
  const isTypingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const [pageInput, setPageInput] = useState("1");
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
        const response = await axiosInstance.get(`/media/pdf/${fileId}`, {
          responseType: "arraybuffer",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        pdfCache.current.set(fileId, url);
        setPdfBlobUrl(url);

      } catch (error) {
        const status = error.response?.status;
        let detail = "Unable to load the PDF. Please try again.";

        setPdfBlobUrl(null);
        setNumPages(0);

        if (error.response?.data instanceof ArrayBuffer) {
          try {
            const decoded = new TextDecoder("utf-8").decode(error.response.data);
            const parsed = JSON.parse(decoded);
            detail = parsed.detail || detail;
          } catch (_) {
            // ignore parse errors
          }
        }

        setError({
          code: status,
          message:
            status === 401
              ? "Unauthorized access"
              : "PDF loading failed",
          detail,
          show: true,
        });

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
          const currentPage = i + 1;

          setPageNumber(currentPage);
          setPageInput(String(currentPage));

          break;
        }
      }
    };

    scrollEl.addEventListener("scroll", handler);
    return () => scrollEl.removeEventListener("scroll", handler);
  }, [numPages]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing in input
      if (e.target.tagName === "INPUT") return;

      if (e.key === "ArrowRight") {
        handleNext();
      }

      if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);


  /* ----------------------------------------
     PAGE NUMBER CHANGE (input)
  ------------------------------------------ */
  const onPageInputChange = (e) => {
    isTypingRef.current = true;
    setPageInput(e.target.value);
  };

  const scrollToPage = (page) => {
    if (!page || page < 1 || page > numPages) return;

    const el = pageRefs.current[page - 1];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setPageNumber(page);
    setPageInput(String(page));
  };


  const handleNext = () => {
    if (pageNumber < numPages) {
      scrollToPage(pageNumber + 1);
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      scrollToPage(pageNumber - 1);
    }
  };

  const applyPageChange = () => {
    isTypingRef.current = false;
    if (pageInput === "") return setPageInput(String(pageNumber));

    const val = Number(pageInput);

    if (val < 1 || val > numPages) {
      setPageInput(String(pageNumber)); // reset
      return;
    }

    setPageNumber(val);

    pageRefs.current[val - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };


  if (loading) {
    return (
      <PdfLoading />
    )
  }


  if (error.show) {
    return (
      <DialogueBox
        errorCode={error.code}
        errorMessage={error.message}
        error={error.detail}
        onClose={() => {
          setError(prev => ({ ...prev, show: false }));
        }}
      />
    )
  }



  return (
    <div
      ref={containerRef}
      className="pdf-viewer w-full h-full flex items-center flex-col bg-[#00000010] rounded-lg overflow-hidden"
    >
      {/* ----------- TOP CONTROLS ----------- */}
      <div className="w-full flex justify-between items-center text-sm sm:text-base bg-black/40 text-white py-2 px-3">
        {/* ZOOM */}
        <div className="flex gap-2 items-center">
          <button onClick={zoomOut} className="p-1 sm:p-2 bg-white/10 rounded-full">
            <ZoomOut size={20} />
          </button>
          <span className="text-sm">
            {(scale * 100).toFixed(0)}%
          </span>
          <button onClick={zoomIn} className="p-1 sm:p-2 bg-white/10 rounded-full">
            <ZoomIn size={20} />
          </button>
          <button onClick={resetZoom} className="px-2 sm:px-3 py-1 bg-gray-300 text-black rounded-md">
            Reset
          </button>
        </div>

        {/* PAGE NAVIGATION */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev} disabled={pageNumber === 1}
            title="Click Left Arrow"
            className="px-2 sm:px-3 py-1 bg-white/10 text-white rounded-md"
          >
            <ChevronLeft />
          </button>
          <span>Page</span>
          <input
            type="number"
            value={pageInput}
            onChange={onPageInputChange}
            onBlur={applyPageChange}
            onKeyDown={(e) => e.key === "Enter" && applyPageChange()}
            className="w-7 sm:w-10 text-center text-black rounded"
          />
          <span> of {numPages}</span>
          <button onClick={handleNext} title="Click Right Arrow" disabled={pageNumber === numPages} className="px-2 sm:px-3 py-1 bg-white/10 text-white rounded-md">
            <ChevronRight />
          </button>

          {/* FULLSCREEN */}
          <button
            onClick={toggleFullscreen}
            className="sm:ml-4 p-1 sm:p-2 bg-white/10 rounded-full"
          >
            {isFullScreen ? <Minimize /> : <Expand />}
          </button>
        </div>
      </div>

      {/* ----------- PDF SCROLL AREA ----------- */}
      <div
        ref={scrollRef}
        className={`w-full h-full overflow-auto ${(scale <= 1) && "items-center"} flex flex-col py-3`}
      >
        {pdfBlobUrl ? (
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
        ) : (
          <div className="text-center text-red-500 space-y-1">
            <p className="font-semibold">{error.detail}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              Try opening a different PDF or contact support if the issue continues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
