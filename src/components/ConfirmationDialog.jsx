import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DialogueBox from "../components/DialogueBox";
import { LoaderCircle } from "lucide-react";
import ReactDOM from "react-dom";
import WarningPopup from "./WarningPopup";
import { requestNotificationPermission, showReminderNotification } from "../services/notificationService";

function ConfirmationDialog({
  message,
  msg,
  buttonName,
  closeButtonName,
  loadingMsg,
  endpoint,
  actionId,
  onClose,
  onSuccess,
}) {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");

  const [error, setError] = useState({
    code: null,
    message: "",
    detail: "",
    show: false,
  });



  const [loading, setLoading] = useState(false);

  async function fetchRemove(endpoint) {

    try {
      setLoading(true);
      let response;

      if (buttonName === "Delete") {
        response = await axiosInstance.delete(`${endpoint}/${actionId}`);

        if (response.status >= 200 && response.status < 300) {
          setSuccessMsg("✔️ Deleted successfully.");
          setTimeout(() => setSuccessMsg(""), 3100);
          return true;
        }
      }

      if (buttonName === "Delete ") {
        const responses = await Promise.all(
          actionId.map((id) =>
            axiosInstance.delete(`${endpoint}/${Number(id)}`)
          )
        );
        const allSuccess = responses.every(
          (res) => res.status >= 200 && res.status < 300
        );

        if (allSuccess) {
          setSuccessMsg("✔️ Deleted successfully.");
          setTimeout(() => setSuccessMsg(""), 3100);
          return true;
        }
      }

      if (buttonName === "Logout") {
        response = await axiosInstance.post(endpoint);

        if (response.status >= 200 && response.status < 300) {
          navigate("/")
          return true;
        }
      }

      if (buttonName === "Enable") {
        const permission =
          Notification.permission === "granted"
            ? "granted"
            : await requestNotificationPermission();

        if (permission === "granted") {
          if (!localStorage.getItem("dailyReminderEnabled")) {
            showReminderNotification();
            localStorage.setItem("dailyReminderEnabled", "true");
          }

          setSuccessMsg(
            "🎉 Great choice! Your daily learning reminder is now active."
          );
          setTimeout(() => setSuccessMsg(""), 3100);
        } else {
          setSuccessMsg(
            "🔕 Notifications are blocked. Please enable them in browser settings."
          );
          setTimeout(() => setSuccessMsg(""), 4000);
        }
      }


      return false;

    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || "Unexpected error";

      setError({
        code: status,
        message: "Request failed",
        detail: detail,
        show: true,
      });

      return false;
    } finally {
      setLoading(false);
    }
  }


  // HANDLE CONFIRM ACTION
  async function handleConfirm() {
    const ok = await fetchRemove(endpoint);
    if (!ok) return;

    // if (buttonName === "Logout") {
    //   window.location.replace("/");
    // }

    if (typeof onSuccess === "function") onSuccess();

    onClose();
  }

  return ReactDOM.createPortal(
    <>
      {/* ERROR POPUP */}
      {error.show && (
        <DialogueBox
          errorCode={error.code}
          errorMessage={error.message}
          error={error.detail}
          onClose={() =>
            setError((prev) => ({ ...prev, show: false }))
          }
        />
      )}
      {successMsg &&
        <WarningPopup
          message={successMsg}
          show={true}
          onClose={() => setSuccessMsg("")}
        />
      }

      {/* DIALOG OVERLAY */}
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[90%] sm:w-[400px] text-center">

          {msg && <p className="text-yellow-700 text-sm">{msg}</p>}

          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {message}
          </h2>

          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
            >
              {loading ? (
                <div className="flex gap-2 items-center">
                  <LoaderCircle className="animate-spin" />
                  <p>{loadingMsg || "Processing..."}</p>
                </div>
              ) : (
                buttonName
              )}
            </button>

            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all"
            >
              {closeButtonName}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root") || document.body
  );
}

export default ConfirmationDialog;
