
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DialogueBox from "../components/DialogueBox";

function Logout() {
  const navigate = useNavigate();
  const [error, setError] = useState({
    code: null,
    message: "",
    detail: "",
    show: false
  });




  async function handleLogout() {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      navigate("/");
      return true;
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail || "Unexpected error";
      setError({
        code: status,
        message: "Request failed",
        detail: detail,
        show: true
      });
      return false;
    }
  }

  const onClose = () => {
    navigate(-1);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      {
        error.show && (
          <DialogueBox
            errorCode={error.code}
            errorMessage={error.message}
            error={error.detail}
            onClose={() => {
              setError(prev => ({ ...prev, show: false }));
              navigate(-1);
            }}
          />
        )
      }
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[90%] sm:w-[400px] text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Are you sure you want to log out?
        </h2>

        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
          >
            Logout
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
