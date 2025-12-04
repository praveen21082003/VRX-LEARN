import React, { useState, useEffect } from "react";
import { Plus, Trash2, File, Folder } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAdmin } from "../../components/context/AdminContextProvider";

function AdminModules() {
  const { allCourses } = useAdmin();

  const [active, setActive] = useState("Courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  // Fetch full course details
  const fetchModules = async (course_id) => {
    try {
      // 1️⃣ Get base course info from allCourses
      const baseInfo = allCourses.find(c => c.id === course_id);
      setSelectedCourse(baseInfo); // always available!

      // 2️⃣ Fetch modules + resources
      const response = await axiosInstance.get(`/courses/${course_id}/full_details`);
      const fullData = response.data;

      setModules(fullData.modules || []);

      const firstModule = fullData.modules?.[0] || null;
      setSelectedModule(firstModule);

      const firstResource = firstModule?.resources?.[0] || null;
      setSelectedResource(firstResource);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchModules(allCourses[0].id);
    }
  }, [allCourses]);

  const tab = (name) =>
    `px-6 py-2 font-semibold cursor-pointer border-b-4 ${active === name
      ? "border-green-600 text-black"
      : "border-transparent text-gray-500 hover:text-black"
    }`;

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Panel */}
      <div className="w-[30%] border-r bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex border-b bg-gray-100 rounded-t-lg">
          <div className={tab("Courses")} onClick={() => setActive("Courses")}>
            Courses
          </div>
          <div className={tab("Modules")} onClick={() => setActive("Modules")}>
            Modules
          </div>
          <div
            className={tab("Resources")}
            onClick={() => setActive("Resources")}
          >
            Resources
          </div>
        </div>

        {/* List Container */}
        <div className="p-2">
          {/* COURSES LIST */}
          {active === "Courses" &&
            allCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => fetchModules(course.id)}
                className={`p-3 rounded-lg mb-2 border cursor-pointer bg-white hover:bg-green-50 transition 
                ${selectedCourse?.id === course.id ? "bg-green-100 font-semibold" : ""
                  }`}
              >
                <h3>{course.name}</h3>
              </div>
            ))}

          {/* MODULE LIST */}
          {active === "Modules" &&
            modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className={`p-3 rounded-lg mb-2 border cursor-pointer hover:bg-blue-50 transition 
                ${selectedModule?.id === m.id ? "bg-blue-100 font-semibold" : ""}`}
              >
                📘 {m.name}
              </div>
            ))}

          {/* RESOURCE LIST */}
          {active === "Resources" &&
            selectedModule?.resources?.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResource(r)}
                className={`p-3 rounded-lg mb-2 border cursor-pointer hover:bg-yellow-50 transition 
                ${selectedResource?.id === r.id
                    ? "bg-yellow-100 font-semibold"
                    : ""
                  }`}
              >
                📄 {r.name} ({r.type})
              </div>
            ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header Tools */}
        <div className="flex justify-end gap-3 mb-4">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
            <Plus size={16} /> Edit
          </button>
          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow">
            <Trash2 size={16} /> Delete
          </button>
        </div>

        {/* DETAILS PANEL */}
        <div className="bg-white p-6 rounded-lg shadow border">
          {active === "Courses" && selectedCourse && (
            <>
              <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
              <p className="text-gray-600 mt-1">Author: {selectedCourse.author}</p>
              <p className="mt-4">{selectedCourse.description}</p>
            </>
          )}
          {/* MODULE DETAILS */}
          {active === "Modules" && selectedModule && (
            <>
              <h2 className="text-2xl font-bold">{selectedModule.name}</h2>
              <p className="text-gray-600 mt-1">
                Module ID: {selectedModule.id}
              </p>

              <h3 className="mt-6 text-lg font-semibold">Resources</h3>
              <ul className="list-disc ml-6">
                {selectedModule.resources?.map((r) => (
                  <li key={r.id}>
                    {r.name} ({r.type})
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* RESOURCE DETAILS */}
          {active === "Resources" && selectedResource && (
            <>
              <h2 className="text-2xl font-bold mb-2">{selectedResource.name}</h2>
              <p className="text-gray-600 mb-2">File Type: {selectedResource.file_type}</p>

              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold">Preview</h3>

                {/* Video Preview */}
                {selectedResource.type === "video" && (
                  <video
                    controls
                    className="w-full rounded mt-3"
                    src={selectedResource.url}
                  />
                )}

                {/* PDF Preview */}
                {selectedResource.type === "pdf" && (
                  <>pdf</>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminModules;
