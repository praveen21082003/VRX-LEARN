import React, { useState, useMemo } from 'react'
import { useAdmin } from '../../components/context/AdminContextProvider'
import WarningPopup from '../../components/WarningPopup';
import { ScanSearch, Grid2x2Plus, Grid2x2Check, Trash2, CircleAlert } from 'lucide-react'
import axiosInstance from '../../api/axiosInstance';
import DialogueBox from '../../components/DialogueBox';
import ConfirmationDialog from '../../components/ConfirmationDialog';

function AdminCourses() {
    const { allCourses, fetchCourses } = useAdmin();
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [searchCourse, setSearchCourse] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [searchedCourseData, setSearchedCourseData] = useState(null);
    const [searchedCourse, setSearchedCourse] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [courseId, setCourseId] = useState(0);
    const [newCourse, setNewCourse] = useState({
        name: "",
        description: "",
        author: ""
    });
    const [formError, setFormError] = useState({
        name: "",
        description: "",
        author: ""
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

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setNewCourse((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = (course) => {
        setShowDeleteBox(true);
        setCourseId(course.id);
        setSearchedCourseData(null);
    }


    function checkFormError() {
        const errors = {}
        if (!newCourse.name.trim()) {
            errors.name = "Course name cannot be empty."
        } else if (!/^[A-Z]/.test(newCourse.name.trim())){
            errors.name = "Course name must start with an uppercase letter."
        }
        if (!newCourse.description.trim()) {
            errors.description = "Description cannot be empty"
        } else if (!/^[A-Z]/.test(newCourse.description.trim())) {
            errors.description = "Description must start with an uppercase letter.";
        }
        else {
            const wordCount = newCourse.description.trim().split(/\s+/).length;
            if (wordCount < 15) {
                errors.description = "Description must be at least 15 words long.";
            }
        }
        if (!newCourse.author.trim()) {
            errors.author = "Author name cannot be empty."
        }

        setFormError(errors);

        return Object.keys(errors).length === 0;
    }


    async function handleSubmit() {
        if (!checkFormError()) {
            return;
        }
        try {
            setCourseLoading(true);
            const response = await axiosInstance.post('/courses/', newCourse);
            if (response.status === 201) {
                fetchCourses();
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1200);
                setNewCourse({
                    name: "",
                    description: "",
                    author: ""
                })
            }
        } catch (error) {
            console.error(error)
            const status = error.response?.status;
            const detail = error.response?.data?.detail || "Unexpected error";
            setError({
                code: status,
                message: "Request failed",
                detail: detail,
                show: true
            });
        } finally {
            setCourseLoading(false);
        }
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
        <div className='bg-white rounded-lg'>
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
            <div className='p-5'>
                <h1 className='subtitle'>Create Course</h1>
                <div className='flex flex-col lg:flex-row justify-evenly items-center border p-1 sm:p-5'>
                    {successMsg ? (
                        <>
                            <WarningPopup
                                message={`✔️Course ${newCourse.name} has been created successfully.`}
                                show={true}
                                onClose={() => setSuccessMsg(false)}
                            />
                            <div className='h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                                <Grid2x2Plus className='animate-bounce' size={60} />
                            </div>
                        </>
                    ) : (
                        <div className='h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                            <Grid2x2Check size={60} />
                        </div>
                    )}
                    <form className='grid grid-cols-2 gap-1 sm:gap-5'>
                        <div>
                            <label>Course Name*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='Enter course name'
                                required
                                name='name'
                                value={newCourse.name}
                                onChange={handleOnChange}
                            />
                            {formError.name && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.name}</p>}
                        </div>

                        <div>
                            <label>Author Name*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='Enter author name'
                                required
                                name='author'
                                value={newCourse.author}
                                onChange={handleOnChange}
                            />
                             {formError.author && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.author}</p>}
                        </div>
                        <div className='col-span-2'>
                            <label>Description*</label>
                            <textarea
                                rows={3}
                                className='input-field'
                                type='text-area'
                                placeholder='Enter description'
                                required
                                name='description'
                                value={newCourse.description}
                                onChange={handleOnChange}
                            />
                             {formError.description && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.description}</p>}
                        </div>
                        <div className='col-span-2 flex justify-center'>
                            <button
                                className='bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold transition delay-100 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110'
                                onClick={handleSubmit}
                                type='button'
                            >
                                {courseLoading ? "Creating.." : "Create"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="p-5">
                <h1 className="subtitle mb-4">Search Course</h1>
                <div className="">
                    <div className="flex flex-row gap-4">
                        <div className="relative w-full lg:w-1/2">
                            <ScanSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                className="border rounded-md w-full h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                type="number"
                                placeholder="Enter course ID"
                                value={searchedCourse}
                                onChange={(e) => setSearchedCourse(e.target.value)}
                            />
                        </div>


                        <button
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4 text-white font-semibold transition-all"
                            type="button"
                            onClick={() => fetchCourse(searchedCourse)}
                        >
                            Search
                        </button>
                    </div>



                    <div className="mt-6 p-5 border rounded-lg shadow-sm bg-gray-50">
                        {searchedCourseData && !Array.isArray(searchedCourse) && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">User Details</h2>

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
                                Search to get Course details
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className='p-5'>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <h3 className="subtitle">All Courses</h3>
                    <div className="relative flex gap-5 w-full lg:w-1/2">
                        <ScanSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            className="border rounded-sm w-full h-10 pl-10 pr-4 text-sm focus:outline-none"
                            type="text"
                            placeholder="Search (e.g., name, user ID, email)"
                            value={searchCourse}
                            onChange={(e) => setSearchCourse(e.target.value)}
                        />

                        <button className='bg-red-600 rounded-lg py-1 px-3 text-white font-semibold' type='button' onClick={() => setSearchCourse("")}>Clear</button>
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
                            {filteredCourses.map((course, index) => (
                                <tr key={course.id}
                                    className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <td className='tabletd'>{course.name}</td>
                                    <td className='tabletd'>{course.description}</td>
                                    <td className='tabletd'>{course.author}</td>
                                    <td className='tabletd'>{course.id}</td>
                                    <td className='tabletd'>{new Date(course.created_at).toLocaleString()}</td>
                                </tr>
                            ))}

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminCourses
