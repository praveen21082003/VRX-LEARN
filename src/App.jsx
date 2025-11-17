import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { LoaderCircle } from 'lucide-react';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Sidebar from "./components/Sidebar";
import Courses from "./pages/Courses";
import LearnPage from "./pages/LearnPage";
import Profile from "./pages/Profile";
import DialogueBox from "./components/DialogueBox";
// import Inbox from "./pages/Inbox";
// import Accountsettings from "./pages/Accountsettings";
import ProtectedRoute from "./components/ProtectedRoute";
import axiosInstance from "./api/axiosInstance";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [errorData, setErrorData] = useState({
    code: null,
    message: "",
    detail: "",
    show: false
  });
  const [authorized, setAuthorized] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [user, setUser] = useState(null);
  const myCoursesRef = useRef(null);
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";









  useEffect(() => {
    if (isLoginPage) {
      setCheckedAuth(true);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data);
        setAuthorized(true);
      } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.detail || "Unexpected error";

        setErrorData({
          code: status,
          message: "Request failed",
          detail: detail,
          show: true
        })
      } finally {
        setCheckedAuth(true);
      }
    };

    fetchUser();
  }, []);

  if (!checkedAuth && !isLoginPage) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl text-gray-600">
        <LoaderCircle className="animate-spin w-20 h-20" /> Loading...
      </div>
    );
  }

  return (
    <>
      {!isLoginPage && errorData.show && (
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
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute authorized={authorized}>
              <div className="flex h-screen">
                <Sidebar
                  myCoursesRef={myCoursesRef}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  mobileOpen={mobileOpen}
                  setMobileOpen={setMobileOpen}
                />
                <div
                  className={`flex-1 dark:bg-[#0b1222] mt-14 sm:mt-0 p-2 sm:p-5 overflow-y-auto transition-all duration-300 ${collapsed ? "sm:ml-16" : "sm:ml-56"
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard ref={myCoursesRef} user={user} error={errorData} />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/learn" element={<Navigate to="/dashboard" />} />
                    <Route path="/learn/:course_id" element={<LearnPage user={user || "VRNexGen"} />} />
                    {/* <Route path="/profile" element={<Profile />} /> */}
                    {/* <Route path="/settings" element={<Accountsettings />} /> */}
                    {/* <Route path="/inbox" element={<Inbox />} /> */}
                    <Route path="/logout" element={<Logout />} />

                    <Route path="*" element={
                      <DialogueBox
                        errorCode={404}
                        errorMessage={"Page Not Found"}
                        error={"Oops! This page doesn't exist. Please verify the URL you entered."}
                        onClose={() => {
                          setErrorData(prev => ({ ...prev, show: false }));
                          navigate(-1);
                        }} />}
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
