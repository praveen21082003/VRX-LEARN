import React, { useState, useEffect } from "react";
import { Paperclip, CircleAlert, FileText, MonitorPlay } from "lucide-react";
import { useAdmin } from "../../components/context/AdminContextProvider";
import WarningPopup from "../../components/WarningPopup";

function CreateResource({ moduleId, moduleName }) {
    const { successMsg, setSuccessMsg, createResource, newResource, setNewResource, resourceLoading } = useAdmin();
    const isPDF = newResource.type === "pdf";


    const [formError, setFormError] = useState({
        name: "",
        type: "",
        url: "",
    });

    useEffect(() => {
        setNewResource((prev) => ({
            ...prev,
            module_id: moduleId,
        }));
    }, [moduleId]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        let updated = { ...newResource, [name]: value };

        if (name === "type") {
            updated.file_type = value === "pdf" ? ".pdf" : value === "video" ? ".mp4" : "";
        }

        setNewResource(updated);

    };

    function checkFormError() {
        const errors = {};

        if (!newResource.name.trim()) {
            errors.name = "Resource name cannot be empty.";
        } else if (!/^[A-Z]/.test(newResource.name.trim())) {
            errors.name = "Resource name must start with an uppercase letter.";
        }

        if (!newResource.type) {
            errors.type = "Resource type cannot be empty.";
        }

        if (!newResource.url.trim()) {
            errors.url = "URL cannot be empty.";
        }

        setFormError(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (!checkFormError()) return;
        createResource();
    };

    return (
        <>
            <h1 className="subtitle">Create Resource</h1>

            <div className="flex flex-col gap-10 lg:flex-row justify-between border items-center p-1 sm:p-5">

                {successMsg ? (
                    <>
                        <WarningPopup
                            message={`✔️ Resource "${newResource.name}" created successfully.`}
                            show={true}
                            onClose={() => setSuccessMsg(false)}
                        />

                        <div className="h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl">
                            {isPDF ? (
                                <FileText className="animate-bounce" size={60} />
                            ) : (
                                <MonitorPlay className="animate-bounce" size={60} />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl">
                        <Paperclip size={60} />
                    </div>
                )}

                <form className="grid grid-cols-2 gap-1 sm:gap-5">

                    <div>
                        <label>Module Name*</label>
                        <input
                            className="input-field bg-gray-100 cursor-not-allowed"
                            type="text"
                            value={moduleName}
                            disabled
                        />
                    </div>

                    <div>
                        <label>Resource Name*</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Enter resource name"
                            name="name"
                            value={newResource.name}
                            onChange={handleOnChange}
                        />
                        {formError.name && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <CircleAlert size={13} />
                                {formError.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Type*</label>
                        <select
                            className="input-field"
                            name="type"
                            value={newResource.type}
                            onChange={handleOnChange}
                        >
                            <option value="">-select-</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                        </select>
                        {formError.type && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <CircleAlert size={13} />
                                {formError.type}
                            </p>
                        )}
                    </div>

                    <div>
                        <label>Resource URL*</label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Enter file URL"
                            name="url"
                            value={newResource.url}
                            onChange={handleOnChange}
                        />
                        {formError.url && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <CircleAlert size={13} />
                                {formError.url}
                            </p>
                        )}
                    </div>

                    <div className="flex col-span-2 justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold hover:-translate-y-1 hover:scale-110 transition"
                        >
                            {resourceLoading ? "Creating Resource..." : "Create Resource"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateResource;
