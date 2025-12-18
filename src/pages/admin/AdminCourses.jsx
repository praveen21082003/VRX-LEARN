import React, { useState, useMemo } from 'react'
import { useAdmin } from '../../components/context/AdminContextProvider'
import WarningPopup from '../../components/WarningPopup';
import { ScanSearch, Grid2x2Plus, Grid2x2Check, Trash2, CircleAlert } from 'lucide-react'
import axiosInstance from '../../api/axiosInstance';
import DialogueBox from '../../components/DialogueBox';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import CreateCourse from '../../adminComponents/reusable/CreateCourse';

function AdminCourses() {
    const { allCourses, fetchCourses, courseLoading, successMsg, newCourse, setNewCourse } = useAdmin();
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [searchCourse, setSearchCourse] = useState("");


    const [searchedCourseData, setSearchedCourseData] = useState(null);
    const [searchedCourse, setSearchedCourse] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [courseId, setCourseId] = useState(0);
    const [formError, setFormError] = useState({
        search_input: "",
    })

    const [error, setError] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });



    const filteredCourses = useMemo(() => {
        return allCourses.filter(course =>
            course.name.toLowerCase().includes(searchCourse.toLowerCase()) ||
            course.author.toLowerCase().includes(searchCourse.toLowerCase()) ||
            String(course.id).includes(searchCourse)
        );

    }, [searchCourse, allCourses]);



    const handleDelete = (course) => {
        setShowDeleteBox(true);
        setCourseId(course.id);
        setSearchedCourseData(null);
    }


    async function fetchCourse(course_id) {
        try {
            setSearchLoading(true);
            const response = await axiosInstance.get(`/courses/${course_id}`)
            setSearchedCourseData(response.data);
        } catch (error) {
            const status = error.response?.status;
            const detail = error.response?.data?.detail || "Unexpected error";
            setError({
                code: status,
                message: "Request failed",
                detail: detail,
                show: true
            });
        } finally {
            setSearchLoading(false);
        }
    }


    return (
        <div className='pagebg'>
            {showDeleteBox &&
                <ConfirmationDialog
                    message="Are you sure you want to delete this course?"
                    msg="⚠️ This action is irreversible and will permanently delete course data."
                    buttonName="Delete"
                    loadingMsg="Deleting..."
                    endpoint="/courses"
                    actionId={courseId}
                    onSuccess={() => { setShowDeleteBox(false); fetchCourses(); }}
                    onClose={() => setShowDeleteBox(false)}
                />
            }
            {error.show &&
                <DialogueBox
                    errorCode={error.code}
                    errorMessage={error.message}
                    error={error.detail}
                    onClose={() => {
                        setError(prev => ({ ...prev, show: false }));
                    }}
                />
            }

            <div className='sm:p-5'>
                <CreateCourse />
            </div>

            <div className="py-10 sm:p-5">
                <h1 className="subtitle mb-4">Search Course</h1>
                <div className="">
                    {formError.search_input && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.search_input}</p>}
                    <div className="flex flex-row gap-4">
                        <div className="relative w-full lg:w-1/2">
                            <ScanSearch
                                className="icon-insearchbar"
                                size={18}
                            />
                            <input
                                className="input-field px-10"
                                type="number"
                                placeholder="Enter course ID"
                                value={searchedCourse}
                                onChange={(e) => setSearchedCourse(e.target.value)}
                            />
                        </div>


                        <button
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4 text-white font-semibold transition-all"
                            type="button"
                            onClick={() => {
                                if (!searchedCourse.trim()) {
                                    setFormError(prev => ({
                                        ...prev,
                                        search_input: "Please enter a Course ID to search.",
                                    }));
                                    return;
                                }
                                setFormError(prev => ({ ...prev, search_input: "" }));
                                fetchCourse(searchedCourse)
                            }}
                        >
                            Search
                        </button>
                    </div>



                    <div className="admin-search">
                        {searchedCourseData && !Array.isArray(searchedCourse) && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Course Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">Course Name</p>
                                        <p className="text-base font-medium">{searchedCourseData.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="text-base font-medium">
                                            {new Date(searchedCourseData.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Author</p>
                                        <p className="text-base font-medium capitalize">{searchedCourseData.author}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Course ID</p>
                                        <p className="text-base font-medium">{searchedCourseData.id}</p>
                                    </div>

                                    <div className='col-span-2'>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-base font-medium">{searchedCourseData.description}</p>
                                    </div>


                                </div>

                                {/* Delete Button */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold shadow-sm transition-all flex items-center gap-2"
                                        onClick={() => handleDelete(searchedCourseData)}
                                    >
                                        <Trash2 size={18} /> Delete Course
                                    </button>
                                </div>
                            </>
                        )}
                        {searchedCourseData === null && (
                            <p className="text-center mt-4 text-red-600 font-medium">
                                Search to view or delete course details.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className='py-10 sm:p-5'>
                <h3 className="subtitle mb-3">All Courses</h3>
                <div className="flex flex-col lg:flex-row justify-between items-center lg:mb-3 gap-2 sm:gap-10">
                    <div className="relative flex gap-5 w-full lg:w-1/2">
                        <ScanSearch
                            className="icon-insearchbar"
                            size={18}
                        />
                        <input
                            className="input-field h-8 px-10"
                            type="text"
                            placeholder="Search (e.g., name, user ID, email)"
                            value={searchCourse}
                            onChange={(e) => setSearchCourse(e.target.value)}
                        />

                        <button className='bg-red-600 rounded-lg px-5 text-white font-semibold' type='button' onClick={() => setSearchCourse("")}>Clear</button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-lg shadow-sm border">
                    <table className='admintabletag'>
                        <thead className="tableheader">
                            <tr>
                                <th className="tableth">Name</th>
                                <th className="tableth">Description</th>
                                <th className="tableth">Author</th>
                                <th className="tableth">Course ID</th>
                                <th className="tableth">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td
                                        className="tabletd text-center py-4 text-gray-500 font-semibold"
                                        colSpan={5}
                                    >
                                        No courses found for this search.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course, index) => (
                                    <tr key={course.id}
                                        className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                                            }`}
                                    >
                                        <td className='tabletd'>{course.name}</td>
                                        <td className='tabletd'><div className='line-clamp-3'>{course.description}</div></td>
                                        <td className='tabletd'>{course.author}</td>
                                        <td className='tabletd w-24'>{course.id}</td>
                                        <td className='tabletd'>{new Date(course.created_at).toLocaleString()}</td>
                                    </tr>
                                )))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div >
    )
}

export default AdminCourses
