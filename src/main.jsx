// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./components/context/ContextProvider.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react"

import "./index.css";
import App from "./App.jsx";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <SpeedInsights />
      {/* <StrictMode> */}
      <App />
      {/* </StrictMode> */}
    </ContextProvider>
  </BrowserRouter>
);
