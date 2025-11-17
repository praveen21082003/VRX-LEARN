import React, { useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useLearn } from "./context/ContextProvider";

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

  const pageRefs = useRef([]);


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

    fetchPdf();
  }, [setPdfBlobUrl, setLoading]);


  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 1.3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.7));
  const resetZoom = () => setScale(1);


  const handlePages = (e) => {
    const value = Number(e.target.value);
    const newPage = Math.min(Math.max(value, 1), numPages);
    setPageNumber(newPage);

    const target = pageRefs.current[newPage - 1];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);


  useEffect(() => {
    if (!numPages) return;

    const container = document.querySelector(".pdf-viewer-container");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPageNumber(Number(entry.target.dataset.pageNumber));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages, setPageNumber]);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:px-6 py-3 
                          bg-black/40 backdrop-blur-md text-white rounded-t-xl shadow-md border border-white/10 
                          w-full overflow-auto">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={zoomOut} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ZoomOut size={22} />
          </button>
          <span className="text-sm">Zoom: {(scale * 100).toFixed(0)}%</span>
          <button onClick={zoomIn} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <ZoomIn size={22} />
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-200 to-gray-400 text-black font-semibold rounded-md hover:from-gray-300 hover:to-gray-500 transition"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Page</span>
          <input
            type="number"
            min="1"
            max={numPages}
            value={pageNumber}
            onChange={handlePages}
            className="border border-gray-300 rounded-md w-12 text-center text-black focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <span>of {numPages}</span>
        </div>
        
      </div>

      {loading ? (
        <p className="text-center mt-10 text-gray-600">Loading PDF...</p>
      ) : (
        <>

          {/* Viewer */}
          <div
            className="pdf-viewer-container overflow-y-scroll flex justify-center w-full sm:h-[89%] px-4 bg-white/60 
                       backdrop-blur-md rounded-b-xl mx-auto shadow-inner"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#A0AEC0 transparent",
            }}
          >
            <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (_, i) => (
                <div
                  key={`page_${i + 1}`}
                  ref={(el) => (pageRefs.current[i] = el)}
                  data-page-number={i + 1}
                  className={`relative mb-6 flex justify-center shadow-md overflow-hidden ${pageNumber === i + 1 ? "ring-2 ring-indigo-400" : ""
                    }`}
                >
                  <Page
                    pageNumber={i + 1}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    scale={scale}
                    width={undefined}
                  />

                  <img
                    src="/logo.png"
                    alt="logo"
                    className="absolute top-4 right-4 w-8 bg-white p-1 rounded-sm opacity-80"
                  />
                </div>
              ))}
            </Document>
          </div>
        </>
      )}
    </div>
  );
}

export default PdfViewer;
