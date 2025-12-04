import { useEffect, useState } from "react";
import { href, Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import WarningPopup from "./WarningPopup";
// import Logout from "../pages/Logout";
import ConfirmationDialog from "./ConfirmationDialog";

import {
  LayoutDashboard,
  Mail,
  Compass,
  GraduationCap,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoveRight,
  BookPlus,
  ListTree
} from "lucide-react";

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, myCoursesRef, user }) {
  const location = useLocation();
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/learn")) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [location, setCollapsed]);

  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/courses")) return "Courses";
    if (location.pathname.startsWith("/learn")) return "Learning Panel";
    if (location.pathname.startsWith("/profile")) return "Profile";
    if (location.pathname.startsWith("/settings")) return "Settings";
    if (location.pathname.startsWith("/")) return "Logout";

    return "VRNexGen";
  };


  const navigationLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", title: "dashboard" },
    { name: "Learn", icon: Compass, title: "learn" },
    { name: "Courses", icon: GraduationCap, href: "/courses", title: "courses" },
    // { name: "Inbox", icon: Mail, href: "/inbox" },
  ];

  const adminNavigationLinks = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", title: "dashboard" },
    { name: "Users", icon: User, href: "/admin/users", title: "users" },
    { name: "Courses", icon: GraduationCap, href: "/admin/courses", title: "courses" },
    { name: "Enrollments", icon: BookPlus, href: "/admin/enrollments", title: "enrollments"},
    { name: "Module List", icon:ListTree, href: "/admin/modules", title: "module list"}
  ];


  // const settingsLinks = [
  //   // { name: "Settings", icon: Settings, href: "/settings" },
  //   // { name: "Profile", icon: User, href: "/profile", title: "profile" },
  //   { name: "Logout", icon: LogOut, href: "/logout", title: "logout" },
  // ];

  const handleLearnClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
    navigate("/dashboard");
    myCoursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => {
    setShowLogout(false);
  };





  return (
    <>
      {showWarning && (
        <WarningPopup
          message="⚠️ Please select a course from the Dashboard before entering Learn!"
          show={true}
          onClose={() => setShowWarning(false)}
        />
      )}

      {/* Mobile toggle */}
      <div className="sm:hidden fixed flex gap-3 bg-[#FFFBF0ff] dark:bg-[#fffbf0b6] items-center top-0 left-0 w-full z-40 border-b-2 text-black 
                px-14 py-2 text-lg font-semibold shadow-md"
        onClick={() => setMobileOpen((prev) => !prev)}>
        <MoveRight size={30} />{getPageTitle()}
      </div>

      <button
        className="sm:hidden fixed flex top-1 z-50 text-black dark:text-white p-2 rounded-md"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 sm:h-screen h-full bg-white dark:bg-[#1a1818] shadow-lg flex flex-col transition-all duration-300 z-40
        ${collapsed ? "w-16" : "w-56"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-60 sm:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between pt-16 sm:pt-5 px-3 py-4 border-b">
          <div className="flex items-center gap-2 dark:bg-[#fffbf0e1] dark:px-1 rounded-sm">
            <img src="/logo.png" alt="logo" className="h-6 w-auto sm:h-8" />
            {!collapsed && (
              <img
                src="/images/VRNEXGEN.png"
                alt="VRNexGen"
                className="h-5 w-auto"
              />
            )}
          </div>

          <button
            className="flex h-6 w-6 m-[-20px] bg-blue-950 dark:bg-slate-500 text-white items-center justify-center rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>



        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">

          {/* If ADMIN */}
          {user?.role === "admin" ? (
            adminNavigationLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition
            ${isActive
                      ? "bg-red-50 dark:bg-[#1F2937] text-red-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-[#1F2937] hover:text-gray-500"
                    }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })
          ) : (
            /* If STUDENT */
            navigationLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                (item.name === "Learn" && location.pathname.startsWith("/learn/")) ||
                (item.href && location.pathname === item.href);

              if (item.name === "Learn") {
                return (
                  <button
                    key="Learn"
                    onClick={handleLearnClick}
                    title={item.title}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition
            ${isActive
                        ? "bg-red-50 dark:bg-[#1F2937] text-red-600 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-[#1F2937] hover:text-gray-500"
                      }`}
                  >
                    <Icon size={20} />
                    {!collapsed && <span>{item.name}</span>}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition
          ${isActive
                      ? "bg-red-50 dark:bg-[#1F2937] text-red-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:dark:bg-[#1F2937] hover:text-gray-500"
                    }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })
          )}

        </div>


        {/* Navigation */}


        <DarkModeToggle collapsed={collapsed} />

        {/* Settings */}
        <div className="border-t px-2 py-4 space-y-2">
          {/* {settingsLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={item.title}
                className="flex items-center gap-3 px-2 py-2 mb-6 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition hover:dark:text-black hover:dark:bg-[#1F2937]"
              >
                <Icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })} */}
          <button
            className="flex w-full items-center gap-3 px-2 py-2 mb-6 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition hover:dark:text-black hover:dark:bg-[#1F2937]"
            onClick={() => setShowLogout(true)}
          >
            <LogOut size={20} />

            {!collapsed && "Logout"}
          </button>
          {showLogout &&
            <ConfirmationDialog
              message="Are you sure you want to log out?"
              msg=""
              buttonName="Logout"
              loadingMsg="Loging out..."
              endpoint="/auth/logout"
              onSuccess={() => setShowLogout(false)}
              onClose={() => setShowLogout(false)}
            />
          }


        </div>
      </div>
    </>
  );
}

export default Sidebar;
