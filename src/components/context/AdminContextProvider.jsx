import React, { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from "../../api/axiosInstance";
import DialogueBox from '../DialogueBox';

const AdminContext = createContext();

export function AdminContextProvider({ children }) {
    const [usersData, setUsersData] = useState({
        items: [],
        total: 0,
        page: 1,
        size: 0,
        pages: 1
    });


    // user pagination
    const [pageNumber, setPageNumber] = useState(1);



    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersCount, setUsersCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [coursesCount, setCoursesCount] = useState(0);
    const [enrollments, setEnrollments] = useState([]);
    // create course
    const [courseLoading, setCourseLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: "",
        description: "",
        author: ""
    });

    // create Module
    const [moduleLoading, setModuleLoading] = useState(false);
    const [newModule, setNewModule] = useState({
        name: "",
    });

    // create resource
    const [resourceLoading, setResourceLoading] = useState(false);
    const [newResource, setNewResource] = useState({
        name: "",
        type: "",
        file_type: "",
        url: "",
        module_id: ""
    });

    // get user 
    const [searchloading, setSearchLoading] = useState(false);
    const [searchedUserData, setSearchedUserData] = useState(null);
    const [error, setError] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });

    useEffect(() => {
        fetchCourses();
        fetchALLEnrollments();
    }, []);


    useEffect(() => {
        fetchUsers();
    }, [pageNumber])

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await axiosInstance.get(`/users?page=${pageNumber}&size=100`);
            // console.log(response);
            const users = response.data

            setUsersData(users);
            setUsersCount(users.total);
            setAdminCount(users.items.filter(a => a.role === 'admin').length);
            setStudentCount(users.items.filter(s => s.role === 'trainee').length);

        } catch (error) {
            console.log("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            const response = await axiosInstance.get("/courses/");
            let courses = response.data

            setAllCourses(courses);
            setCoursesCount(courses.length);
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
            setLoadingCourses(false);
        }
    }


    const fetchALLEnrollments = async () => {

        try {
            const response = await axiosInstance.get('/enrollments/aggregated');
            setEnrollments(response.data);
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

        }
    }


    async function createCourse() {
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


    async function createModule() {
        try {
            setModuleLoading(true);
            const response = await axiosInstance.post('/modules/', newModule);
            if (response.status === 201) {
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1200);
                setNewModule({
                    name: "",
                })
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
            setModuleLoading(false);
        }
    }


    async function createResource() {
        try {
            setResourceLoading(true);
            const response = await axiosInstance.post('/resources/', newResource)
            if (response.status === 201) {
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1200);
                setNewResource({
                    name: "",
                    type: "",
                    file_type: "",
                    url: "",
                    module_id: ""
                })
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
            setResourceLoading(false);
        }
    }


    return (
        <>
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
            <AdminContext.Provider value={{
                usersData, loadingUsers, usersCount, adminCount, studentCount, courseLoading, allCourses, coursesCount, enrollments, successMsg, loadingCourses, newCourse, newModule, newResource, moduleLoading, resourceLoading, pageNumber, setPageNumber, setNewCourse, setNewResource, setNewModule, fetchUsers, fetchCourses, fetchALLEnrollments, createCourse, createModule, createResource
            }}>

                {children}
            </AdminContext.Provider>
        </>
    );
}


export const useAdmin = () => useContext(AdminContext);
