import React, { useEffect, useState } from 'react'
import { BookOpen, ListTree, Files, Plus, Trash2, ChevronRight } from "lucide-react";
import { useAdmin } from "../../components/context/AdminContextProvider";
import axiosInstance from '../../api/axiosInstance';
import CreateCourse from '../../adminComponents/reusable/CreateCourse';


function AdminModules() {
  const { allCourses } = useAdmin();

  const [active, setActive] = useState("Courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);


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
    `flex items-center justify-center gap-1 px-1 py-2 font-semibold cursor-pointer border-b-4 ${active === name
      ? "border-green-600 text-black"
      : "border rounded-t-lg text-sm text-gray-500 hover:text-black"
    }`;


  return (
    <div className='bg-white h-full rounded-lg overflow-hidden'>
      <header className="bg-slate-100 text-slate-900 h-12 flex items-center border-b w-full">

        <div className="flex w-[30%] rounded-t-l">
          <div className={tab("Courses")} onClick={() => setActive("Courses")}>
            <BookOpen size={18} />Courses
          </div>
          <div className={tab("Modules")} onClick={() => setActive("Modules")}>
            <ListTree size={18} /> Modules
          </div>
          <div
            className={tab("Resources")}
            onClick={() => setActive("Resources")}
          >
            <Files size={18} /> Resources
          </div>
        </div>

        <div className='flex justify-between w-full'>

          <div className="text-sm text-gray-600 font-medium flex gap-1">
            <ChevronRight className='text-green-700' size={20} />
            {active === "Courses" && selectedCourse && (
              <span>{selectedCourse.name}</span>
            )}

            {active === "Modules" && selectedCourse && (
              <span>
                {selectedCourse.name} /{" "}
                {selectedModule ? selectedModule.name : "No Modules"}
              </span>
            )}

            {active === "Resources" && selectedCourse && (
              <span>
                {selectedCourse.name} /{" "}
                {selectedModule ? selectedModule.name : "No Modules"} /{" "}
                {selectedResource ? selectedResource.name : "No Resources"}
              </span>
            )}

          </div>


          <div className='flex gap-3'>
            <button className="flex items-center gap-2 text-gray-700 px-2 py-1">
              <Plus size={20} />
            </button>
            <button className="flex items-center gap-2 text-gray-700 px-2 py-1">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

      </header>
      <div className="flex h-full w-full bg-gray-50">
        <div className="w-[30%] border-r bg-white shadow-sm">
          {active === "Courses" &&
            allCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => fetchModules(course.id)}
                className={`p-3 border-b cursor-pointer hover:bg-green-50 transition 
                ${selectedCourse?.id === course.id ? "bg-blue-100 font-semibold" : ""
                  }`}
              >
                <h3>{course.name}</h3>
              </div>
            ))}
          {active === "Modules" &&
            modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                className={`p-3 border-b cursor-pointer hover:bg-blue-50 transition 
                ${selectedModule?.id === m.id ? "bg-blue-100 font-semibold" : ""}`}
              >
                {m.name}
              </div>
            ))}
          {active === "Resources" &&
            selectedModule?.resources?.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResource(r)}
                className={`p-3 border-b cursor-pointer hover:bg-yellow-50 transition 
                ${selectedResource?.id === r.id
                    ? "bg-yellow-100 font-semibold"
                    : ""
                  }`}
              >
                {r.name} ({r.type})
              </div>
            ))}

        </div>
        <div className='p-6 w-full h-full'>
          {active === "Courses" && selectedCourse && (
            <>
              <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
              <p className="text-gray-600 mt-1">Author: {selectedCourse.author}</p>
              <p className='mt-4'><label className='text-gray-600'>Description: </label>{selectedCourse.description}</p>
              <div className='py-5'>
                <CreateCourse/>
              </div>
            </>
          )}
          {active === "Modules" && (
            selectedModule ? (
              <>
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
                  <div className="text-gray-500 mt-2 ml-2">No Resources in this Module</div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center text-gray-500 h-full">
                No Modules for the selected Course
              </div>
            )
          )}
          {active === "Resources" && (selectedResource ? (
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
          ) : (
          <div className="flex justify-center items-center text-gray-500 h-full">
            No resources for the selected Course
          </div>)
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminModules
