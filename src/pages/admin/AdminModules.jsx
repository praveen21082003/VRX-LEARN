import React, { useEffect, useState, useRef } from 'react'
import { BookOpen, Search, ListTree, Files, Plus, Trash2, ChevronRight, X, SquarePen } from "lucide-react";
import { useAdmin } from "../../components/context/AdminContextProvider";
import axiosInstance from '../../api/axiosInstance';
import AdminCRUDDialog from '../../adminComponents/reusable/AdminCRUDDialog';
import ModuleVideo from "../../components/Video";


function AdminModules({user}) {
  const { allCourses, successMsg } = useAdmin();

  const [active, setActive] = useState("Courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);


  const videoRef = useRef(null);

  const videoURL = selectedResource?.type === "video"
    ? `${axiosInstance.defaults.baseURL}/media/video/${selectedResource.url}`
    : "";


  // CRUD
  const [showCreate, setShowCreate] = useState(false);
  const [create, setCreate] = useState("");

  useEffect(() => {
    if (selectedCourse?.id) {
      fetchModules(selectedCourse.id);
    }
  }, [successMsg]);


  const fetchModules = async (course_id) => {
    try {
      // info of allCourses
      const baseInfo = allCourses.find(c => c.id === course_id);
      setSelectedCourse(baseInfo);

      const response = await axiosInstance.get(`/courses/${course_id}/full_details`);
      const fullData = response.data
      setModules(fullData.modules || []);

      const firstModule = fullData.modules?.[0] || null;
      setSelectedModule(firstModule);

      const firstResource = firstModule?.resources?.[0] || null;
      setSelectedResource(firstResource);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchModules(allCourses[0].id);
    }
  }, [allCourses]);


  const tab = (name) =>
    `flex items-center justify-center gap-1 px-3 py-2 font-semibold cursor-pointer border-b-4 ${active === name
      ? "border-green-600 text-black"
      : "border rounded-t-lg text-sm text-gray-500 hover:text-black"
    }`;


  return (
    <div className="bg-white h-full rounded-lg overflow-hidden flex flex-col">
      {showCreate && <AdminCRUDDialog
        courseId={selectedCourse?.id}
        courseName={selectedCourse?.name}
        moduleId={selectedModule?.id}
        moduleName={selectedModule?.name}
        action={create}
        onClose={() => setShowCreate(false)}
      />}

      <header className="bg-slate-100 text-slate-900 h-12 flex items-center border-b">

        <div className="flex justify-center min-w-[30%]">
          <div className={tab("Courses")} onClick={() => setActive("Courses")}>
            <BookOpen size={18} /> Courses
          </div>
          <div className={tab("Modules")} onClick={() => setActive("Modules")}>
            <ListTree size={18} /> Modules
          </div>
          <div className={tab("Resources")} onClick={() => setActive("Resources")}>
            <Files size={18} /> Resources
          </div>
        </div>

        <div className="flex-1 flex justify-between">
          <div className="text-sm text-gray-700 font-medium flex items-center gap-1">
            <ChevronRight className="text-green-700" size={18} />
            {active === "Courses" && selectedCourse && <span>{selectedCourse.name}</span>}
            {active === "Modules" && selectedCourse && (
              <span>
                {selectedCourse.name} / {selectedModule ? selectedModule.name : "No Modules"}
              </span>
            )}
            {active === "Resources" && selectedCourse && (
              <span>
                {selectedCourse.name} / {selectedModule ? selectedModule.name : "No Modules"} /{" "}
                {selectedResource ? selectedResource.name : "No Resources"}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 mr-5 font-semibold">
          <button className="flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-l-lg text-sm"
            onClick={() => {
              setShowCreate(true);
              setCreate(`create${active}`);
            }}
          >
            <Plus size={18} /> Add {active}
          </button>
          <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-r-lg text-sm">
            <Trash2 size={18} />
          </button>
        </div>

      </header>

      <div className="flex flex-1 w-full bg-gray-50 overflow-hidden">

        <div className="w-full md:w-[30%] border-r bg-white overflow-y-auto">
          <div className='flex justify-between gap-2 h-7 border-b px-1'>
            <input type='checkbox' />
            <div className="relative w-full">
              <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-70" />
              <input
                type="text"
                className="w-full pl-5 bg-transparent outline-none"
                placeholder={`Search ${active} (eg.ID,Name)`}
              />
            </div>
            <div className='flex gap-1'>
              {/* <button className=''><X size={18} /></button> */}
              <button className='text-green-700' onClick={() => { setShowCreate(true); setCreate(`create${active}`) }}><Plus size={18} /></button>
              <button className='text-red-600'><Trash2 size={18} /></button>
            </div>

          </div>
          {active === "Courses" &&
            allCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => fetchModules(course.id)}
                className={`p-3 border-b cursor-pointer hover:bg-green-50 transition ${selectedCourse?.id === course.id ? "bg-blue-100 font-semibold" : ""
                  }`}
              >
                {course.name}
              </div>
            ))}

          {active === "Modules" &&
            modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className={`p-3 border-b cursor-pointer hover:bg-blue-50 transition ${selectedModule?.id === m.id ? "bg-blue-100 font-semibold" : ""
                  }`}
              >
                {m.name}
              </div>
            ))}

          {active === "Resources" &&
            selectedModule?.resources?.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResource(r)}
                className={`p-3 border-b cursor-pointer hover:bg-yellow-50 transition ${selectedResource?.id === r.id ? "bg-yellow-100 font-semibold" : ""
                  }`}
              >
                {r.name} ({r.type})
              </div>
            ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">

          {active === "Courses" && selectedCourse && (
            <div>
              <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
              <p className="text-gray-600 mt-1">Author: {selectedCourse.author}</p>
              <p className="mt-4 text-gray-700">{selectedCourse.description}</p>
            </div>
          )}

          {active === "Modules" &&
            (selectedModule ? (
              <div>
                <h2 className="text-2xl font-bold">{selectedModule.name}</h2>
                <p className="text-gray-600 mt-1">Module ID: {selectedModule.id}</p>

                <h3 className="mt-6 text-lg font-semibold">Resources</h3>

                {selectedModule.resources?.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {selectedModule.resources.map((r) => (
                      <li key={r.id}>
                        {r.name} ({r.type})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 mt-4">No Resources in this Module</div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center text-gray-500 h-full">
                No Modules for the selected Course
              </div>
            ))}

          {active === "Resources" &&
            (selectedResource ? (
              <div>
                <h2 className="text-2xl font-bold">{selectedResource.name}</h2>
                <p className="text-gray-600 mt-1">Resource ID: {selectedResource.id}</p>
                <p className="text-gray-600">File Type: {selectedResource.file_type}</p>

                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold">Preview</h3>

                  {selectedResource.type === "video" && (
                    <ModuleVideo
                      videoRef={videoRef}
                      video_URL={videoURL}
                      user={user}
                      onNextVideo={() => alert("Next Video Triggered")}
                    />
                  )}

                  {selectedResource.type === "pdf" && <div className="mt-3">PDF Preview</div>}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center text-gray-500 h-full">
                No Resources for the selected Module
              </div>
            ))}

          <div className="flex gap-3 py-5 font-semibold">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <SquarePen size={15} />
              Edit {active}
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <Trash2 size={15} />
              Delete {active}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminModules
