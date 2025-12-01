import React, { useState, useMemo } from 'react'
import { BookPlus, BookCheck, BookMarked, ScanSearch, Trash2 } from 'lucide-react';
import { useAdmin } from '../../components/context/AdminContextProvider'
import DialogueBox from '../../components/DialogueBox';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import WarningPopup from '../../components/WarningPopup';
import axiosInstance from '../../api/axiosInstance';

function AdminEnrollments() {
    const { enrollments, fetchALLEnrollments } = useAdmin();
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
        course_id: ""
    })
    const [error, setError] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });


    const filteredData = useMemo(() => {
        return enrollments.filter(enrollment =>
            String(enrollment.user_id).includes(searchEnrollment) ||
            String(enrollment.course_id).includes(searchEnrollment)
        );
    }, [searchEnrollment, enrollments]);



    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setNewEnrollment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


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
            errors.user_id = "This field cannot be empty"
        }

        if (!newEnrollment.course_id.trim()) {
            errors.course_id = "This field cannot be empty"
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
            const response = await axiosInstance.post('/enrollments/', newEnrollment);
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


    const handleDelete = (course) => {
        setShowDeleteBox(true);
        setEnrollmentId(course.course_id);
        setSearchedEnrollmentData(null);
    }

    return (
        <div className='bg-white rounded-lg'>
            {showDeleteBox &&
                <ConfirmationDialog
                    message="Delete this user permanently?"
                    msg="⚠️ The enrollment will be permanently removed."
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
            <div className='p-5'>
                <h1 className='subtitle'>Create Enrollment</h1>
                <div className='flex flex-col lg:flex-row justify-evenly items-center border p-1 sm:p-5'>

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

                    <form className='grid grid-cols-2 gap-1 sm:gap-5'>

                        <div>
                            <label>User ID*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='enter userId'
                                required
                                name='user_id'
                                value={newEnrollment.user_id}
                                onChange={handleOnChange}
                            />
                            {formError.user_id && <p className='text-xs text-red-500'>{formError.user_id}</p>}
                        </div>


                        <div>
                            <label>Course Id*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='enter CourseId'
                                required
                                name='course_id'
                                value={newEnrollment.course_id}
                                onChange={handleOnChange}
                            />
                            {formError.course_id && <p className='text-xs text-red-500'>{formError.course_id}</p>}
                        </div>
                        <div className='col-span-2 flex justify-center'>
                            <button
                                className='bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold transition delay-100 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110'
                                onClick={handleSubmit}
                                type='button'
                            >
                                {enrollmentLoading ? "Enrolling.." : "Enrolle"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="p-5">
                <h1 className="subtitle mb-4">Search Enrollment</h1>
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
                                placeholder="Enter enrollment ID"
                                value={searchedEnrollment}
                                onChange={(e) => setSearchedEnrollment(e.target.value)}
                            />
                        </div>


                        <button
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4 text-white font-semibold transition-all"
                            type="button"
                            onClick={() => featchEnrollment(searchedEnrollment)}
                        >
                            Search
                        </button>
                    </div>



                    <div className="mt-6 p-5 border rounded-lg shadow-sm bg-gray-50">
                        {searchedEnrollmentData && !Array.isArray(searchedEnrollment) && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">User Id</p>
                                        <p className="text-base font-medium">{searchedEnrollmentData.user_id}</p>
                                    </div>

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

            <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <h3 className="subtitle">All Enrollments</h3>
                    <div className="relative flex gap-5 w-full lg:w-1/2">
                        <BookMarked
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            className="border rounded-sm w-full h-10 pl-10 pr-4 text-sm focus:outline-none"
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
                                <th className="tableth">UserId</th>
                                <th className="tableth">CourseId</th>
                                <th className="tableth">EnrollmentId</th>
                                <th className="tableth">Enrolled At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData
                                .map((enrollment, index) => (
                                    <tr
                                        key={enrollment.id}
                                        className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`}
                                    >
                                        <td className="tabletd">{enrollment.user_id}</td>
                                        <td className="tabletd">{enrollment.course_id}</td>
                                        <td className="tabletd">{enrollment.id}</td>
                                        <td className="tabletd">
                                            <div className={`${searchEnrollment && "flex justify-between"}`}>
                                                {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminEnrollments
