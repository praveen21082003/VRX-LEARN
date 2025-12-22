import React, { useEffect, useState } from "react";
import { Mail, LockKeyhole, LoaderCircle, Linkedin, Github, Youtube, Globe, TriangleAlert } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { areCookiesEnabled } from "../services/cookiesService";

function Login() {
  const [credentials, setCredentials] = useState({ email_id: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };




  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!credentials.email_id || !credentials.password) {
      setErrorMessage("Please fill out both fields.");
      return;
    }

    if (!areCookiesEnabled()) {
      setErrorMessage(
        "🍪 Cookies are disabled. Please enable cookies to continue."
      );
      return;
    }

    try {
      setLoading(true);


      const response = await axiosInstance.post("/auth/login", credentials);
      if (response.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setErrorMessage(error.response.detail);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-[#FFFBF0ff] h-screen items-center px-10 sm:px-5 md:px-0">
      <div className="relative h-auto w-[400px] shadow-2xl rounded-lg bg-white flex flex-col justify-center">
        <div className="p-5">
          {/* Logo and Title */}
          <div className="p-5 flex flex-col items-center">
            <img src="./logo.png" alt="logo" className="w-9 h-auto" />
            <h1 className="font-bold text-3xl text-center">Login</h1>
            {errorMessage && (
              <p className="flex gap-1 items-center text-red-500 text-sm text-center mt-2">
                <TriangleAlert size={15} />{errorMessage}
              </p>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="pb-10 grid grid-flow-row gap-10 w-full">
            <div className="relative w-full">
              <input
                className="border-b-2 w-full p-2 pl-10 focus:outline-none"
                type="text"
                name="email_id"
                placeholder="Email ID"
                value={credentials.email_id}
                onChange={handleChange}
              />
              <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 scale-90" />
            </div>

            <div className="relative w-full">
              <input
                className="border-b-2 w-full p-2 pl-10 focus:outline-none"
                name="password"
                placeholder="Password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
              />
              <LockKeyhole className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 scale-90" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-10 flex items-center justify-center rounded-lg transition text-white 
                ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#3f3f3f] hover:bg-[#555]"} 
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin text-white" size={18} />
                  <p className="text-sm">Logging in...</p>
                </div>
              ) : (
                "Login"
              )}
            </button>

          </form>
        </div>

        <div className="text-center flex  flex-col py-10 gap-4">
          {/* <a href="#" className="text-blue-500 font-semibold">
            or Sign Up
          </a> */}
          <div className='flex justify-center gap-4 text-gray-700'>
            <a href="https://www.linkedin.com/company/vrnexgen/" className="hover:text-blue-700" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            <a href="https://vrnexgen1.com" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer"><Globe size={20} /></a>
            <a href="#" className="hover:text-gray-300" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
            <a href="https://www.youtube.com/@VRNeXGen1" className="hover:text-red-500" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
          </div>
          <a href="#" className="text-gray-400 font-semibold">
            forgot password?
          </a>
        </div>

      </div>
    </div>
  );
}

export default Login;
