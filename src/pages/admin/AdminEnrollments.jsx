import React, { useState, useMemo } from 'react'
import { BookPlus, BookCheck, BookMarked, ScanSearch, Trash2, X, CircleAlert } from 'lucide-react';
import { useAdmin } from '../../components/context/AdminContextProvider'
import DialogueBox from '../../components/DialogueBox';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import WarningPopup from '../../components/WarningPopup';
import axiosInstance from '../../api/axiosInstance';

function AdminEnrollments() {
    const { enrollments, fetchALLEnrollments, allCourses, usersData } = useAdmin();
    const [successMsg, setSuccessMsg] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [enrollmentLoading, setEnrollmentLoading] = useState(false);
    const [searchEnrollment, setSearchEnrollment] = useState("");
    const [searchedEnrollment, setSearchedEnrollment] = useState("");
    const [searchedEnrollmentData, setSearchedEnrollmentData] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [newEnrollment, setNewEnrollment] = useState({
        user_id: "",
        course_id: ""
    });
    const [formError, setFormError] = useState({
        user_id: "",
        course_id: "",
        search_input: "",
    })
    const [error, setError] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });
    const [searchedUserData, setSearchedUserData] = useState(null);
    const [openUsers, setOpenUsers] = useState(false);
    const [openCourses, setOpenCourses] = useState(false);
    const [hover, setHover] = useState(null);


    const filteredData = useMemo(() => {
        return enrollments.filter(enrollment =>
            String(enrollment.user_id).includes(searchEnrollment) ||
            String(enrollment.course_id).includes(searchEnrollment)
        );
    }, [searchEnrollment, enrollments]);




    async function featchEnrollment(enrollment_id) {
        try {
            setSearchLoading(true);
            const response = await axiosInstance.get(`/enrollments/${enrollment_id}`)
            setSearchedEnrollmentData(response.data);
        } catch (error) {
            console.log(error)
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

    function CheckFormError() {
        const errors = {};
        if (!newEnrollment.user_id.trim()) {
            errors.user_id = "Username cannot be empty"
        }
        else if (!newEnrollment.user_id_value){
            errors.user_id = "Please select a user from the dropdown."
        }

        if (!newEnrollment.course_id.trim()) {
            errors.course_id = "Coursename cannot be empty"
        }
        else if (!newEnrollment.course_id_value){
            errors.course_id = "Please select a course from the dropdown."
        }

        setFormError(errors);

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit() {

        if (!CheckFormError()) {
            return;
        }

        try {
            setEnrollmentLoading(true);
            const response = await axiosInstance.post('/enrollments/', {
                user_id: newEnrollment.user_id_value,
                course_id: newEnrollment.course_id_value
            });

            if (response.status === 201) {
                fetchALLEnrollments();
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1200);
                setNewEnrollment({
                    user_id: "",
                    course_id: ""
                })
                setFormError({
                    user_id: "",
                    course_id: ""
                });
            }
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
            setEnrollmentLoading(false);
        }
    }



    const handleDelete = async (enrollment) => {
        await fetchUser(enrollment.user_id)
        setShowDeleteBox(true);
        setEnrollmentId(enrollment.id);
        setSearchedEnrollmentData(null);
    }


    async function fetchUser(user_id) {
        try {
            setSearchLoading(true);
            const response = await axiosInstance.get(`/users/${user_id}`)
            setSearchedUserData(response.data);
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
                    message={`Delete  ${searchedUserData.fullname}'s enrollment permanently?`}
                    msg={`You are about to delete user enrollmets (${searchedUserData.email_id}). Proceed?`}
                    buttonName="Delete"
                    loadingMsg="Deleting..."
                    endpoint="/enrollments"
                    actionId={enrollmentId}
                    onSuccess={() => { setShowDeleteBox(false); fetchALLEnrollments(); }}
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
                <h1 className='subtitle'>Create Enrollment</h1>
                <div className='flex flex-col lg:flex-row justify-evenly items-center border p-2 sm:p-5'>

                    {successMsg ? (
                        <>
                            <WarningPopup
                                message={`✔️Enrollement created successfully.`}
                                show={true}
                                onClose={() => setSuccessMsg(false)}
                            />
                            <div className='h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                                <BookCheck className='animate-bounce' size={60} />
                            </div>
                        </>
                    ) : (
                        <div className='h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                            <BookPlus size={60} />
                        </div>
                    )}

                    <form className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2" onClick={() => {setOpenUsers(false); setOpenCourses(false);}}>

                        <div className="relative w-full">
                            <label>User Name*</label>

                            <input
                                className="input-field w-full"
                                value={newEnrollment.user_id}
                                placeholder="Search user...(eg.name,id)"
                                // onClick={() => setOpenUsers(!openUsers)}
                                onChange={(e) => {
                                    setOpenUsers(true);
                                    setNewEnrollment({ ...newEnrollment, user_id: e.target.value, user_id_value: null });
                                }}

                            />


                            {openUsers && (
                                <div className="absolute w-full bg-white border shadow-md rounded max-h-40 overflow-y-auto z-0 mt-1">
                                    {usersData
                                        .filter(user =>
                                            user.fullname.toLowerCase().includes(newEnrollment.user_id.toLowerCase()) ||
                                            String(user.id).includes(newEnrollment.user_id)
                                        )
                                        .map(user => (
                                            <div
                                                onMouseEnter={() => setHover(user.id)}
                                                onMouseLeave={() => setHover(null)}
                                                key={user.id}
                                                onClick={() => {
                                                    setNewEnrollment({
                                                        ...newEnrollment,
                                                        user_id: user.fullname,
                                                        user_id_value: user.id
                                                    });
                                                    setOpenUsers(false);
                                                }}
                                                className="relative p-2 cursor-pointer hover:bg-gray-100"

                                            >
                                                {user.fullname}
                                                <span className="block text-xs text-gray-600">
                                                    ({user.email_id})
                                                </span>
                                                {hover === user.id && (
                                                    <div className="absolute right-3 top-[70%] -translate-y-1/2 bg-black opacity-90 text-white text-xs px-2 py-1 shadow z-50 whitespace-nowrap">
                                                        User ID: {user.id}
                                                    </div>
                                                )}

                                            </div>
                                        ))}
                                </div>
                            )}
                            {formError.user_id && (
                                <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.user_id}</p>
                            )}
                        </div>


                        <div className="relative w-full">
                            <label>Course Name*</label>
                            <input
                                className="input-field w-full"
                                value={newEnrollment.course_id}
                                placeholder="Search course...(eg.name,id)"
                                onChange={(e) => {
                                    setOpenCourses(true);
                                    setNewEnrollment({ ...newEnrollment, course_id: e.target.value });
                                }}
                            />


                            {openCourses && (
                                <div className="absolute w-full bg-white border shadow-md rounded max-h-40 overflow-y-auto z-50 mt-1">
                                    {allCourses
                                        .filter(course =>
                                            course.name.toLowerCase().includes(newEnrollment.course_id.toLowerCase()) ||
                                            String(course.id).includes(newEnrollment.course_id)
                                        )
                                        .map(course => (
                                            <div
                                                key={course.id}
                                                onClick={() => {
                                                    setNewEnrollment({
                                                        ...newEnrollment,
                                                        course_id: course.name,
                                                        course_id_value: course.id
                                                    });
                                                    setOpenCourses(false);
                                                }}
                                                className="relative p-2 cursor-pointer hover:bg-gray-100"
                                                title={`Course ID: ${course.id}`}
                                            >
                                                {course.name}
                                                <span className="block text-xs text-gray-600">
                                                    (Course Id : {course.id})
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                            {formError.course_id && (
                                <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.course_id}</p>
                            )}
                        </div>

                        <div className='lg:col-span-2 flex justify-center mt-6'>
                            <button
                                className='bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold transition delay-100 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110'
                                onClick={handleSubmit}
                                type='button'
                            >
                                {enrollmentLoading ? "Enrolling.." : "Enroll"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="py-10 sm:p-5">
                <h1 className="subtitle mb-4">Delete Enrollment</h1>
                <div className="">
                    {formError.search_input && (
                        <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.search_input}</p>
                    )}
                    <div className="flex flex-row gap-4">
                        <div className="relative w-full lg:w-1/2">
                            <ScanSearch
                                className="icon-insearchbar"
                                size={18}
                            />
                            <input
                                className="input-field px-10"
                                type="number"
                                placeholder="Enter enrollment ID"
                                value={searchedEnrollment}
                                onChange={(e) => setSearchedEnrollment(e.target.value)}
                            />
                        </div>


                        <button
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4 text-white font-semibold transition-all"
                            type="button"
                            onClick={() => {
                                if (!searchedEnrollment.trim()) {
                                    setFormError(prev => ({
                                        ...prev,
                                        search_input: "Please enter a Enrollment ID to search.",
                                    }));
                                    return;
                                }
                                setFormError(prev => ({ ...prev, search_input: "" }));
                                featchEnrollment(searchedEnrollment);
                            }}
                        >
                            Search
                        </button>
                    </div>



                    <div className="admin-search">
                        {searchedEnrollmentData && !Array.isArray(searchedEnrollment) && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">User Id</p>
                                        <p className="text-base font-medium">{searchedEnrollmentData.user_id}</p>
                                    </div>
                                    {/* <div>
                                        <p className="text-sm text-gray-500">User Name</p>
                                        <p className="text-base font-medium">{searchedUserData.fullname}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">User email ID</p>
                                        <p className="text-base font-medium">{searchedUserData.email_id}</p>
                                    </div> */}
                                    <div>
                                        <p className="text-sm text-gray-500">Course Id</p>
                                        <p className="text-base font-medium">
                                            {searchedEnrollmentData.course_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Enrollment ID</p>
                                        <p className="text-base font-medium capitalize">{searchedEnrollmentData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Enrolled At</p>
                                        <p className="text-base font-medium capitalize">{new Date(searchedEnrollmentData.enrolled_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold shadow-sm transition-all flex items-center gap-2"
                                        onClick={() => handleDelete(searchedEnrollmentData)}
                                    >
                                        <Trash2 size={18} /> Delete Enrollment
                                    </button>
                                </div>
                            </>
                        )}
                        {searchedEnrollmentData === null && (
                            <p className="text-center mt-4 text-red-600 font-medium">
                                Search to get Course details
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <h3 className="subtitle">All Enrollments</h3>
                    <div className="relative flex gap-5 w-full lg:w-1/2">
                        <BookMarked
                            className="icon-insearchbar"
                            size={18}
                        />
                        <input
                            className="input-field px-10"
                            type="number"
                            placeholder="Search (eg.userId,CourseId)"
                            value={searchEnrollment}
                            onChange={(e) => setSearchEnrollment(e.target.value)}
                        />
                        <button className='bg-red-600 rounded-lg py-1 px-3 text-white font-semibold' type='button' onClick={() => setSearchEnrollment("")}>Clear</button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg shadow-sm border">
                    <table className="admintabletag">
                        <thead className="tableheader">
                            <tr>
                                <th className="tableth">Username</th>
                                <th className="tableth">Course Name</th>
                                <th className="tableth">EnrollmentId</th>
                                <th className="tableth">Enrolled At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        className="tabletd text-center py-4 text-gray-500 font-semibold"
                                        colSpan={5}
                                    >
                                        No enrollment found for this search.
                                    </td>
                                </tr>
                            ) : (
                                filteredData
                                    .map((enrollment, index) => (
                                        <tr
                                            key={enrollment.id}
                                            className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                                                }`}
                                        >
                                            <td className="tabletd">{enrollment.username}</td>
                                            <td className="tabletd">{enrollment.course_name}</td>
                                            <td className="tabletd">{enrollment.id}</td>
                                            <td className="tabletd">
                                                <div className={`${searchEnrollment && "flex justify-between"}`}>
                                                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    )))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminEnrollments
