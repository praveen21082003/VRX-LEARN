import { createContext, useState, useContext } from "react";

const Context = createContext();

export function ContextProvider({ children }) {
  // learn context
  const [learnData, setLearnData] = useState(null);
  // course context
  const [courseData, setCourseData] = useState(null);
  const [myCourseData, setMyCourseData] = useState(null);
  // PDF context
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.4);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);


  return (
    <Context.Provider value={{
      learnData, setLearnData,
      courseData, setCourseData,
      myCourseData, setMyCourseData,
      numPages, setNumPages,
      pageNumber, setPageNumber,
      scale, setScale,
      pdfBlobUrl, setPdfBlobUrl,
      loading, setLoading,
    }}>
      {children}
    </Context.Provider>
  );
}

export function useLearn() {
  return useContext(Context);
}
