import React, { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from "../../api/axiosInstance";

const AdminContext = createContext();

export function AdminContextProvider({ children }) {
    const [usersData, setUsersData] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [usersCount, setUsersCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [coursesCount, setCoursesCount] = useState(0);
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchCourses();
        fetchALLEnrollments();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await axiosInstance.get("/users/");
            const users = response.data

            setUsersData(users);
            setUsersCount(users.length);
            setAdminCount(users.filter(a => a.role === 'admin').length);
            setStudentCount(users.filter(s => s.role === 'trainee').length);

        } catch (error) {
            console.log("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchCourses = async ()=>{
        try{
            setLoadingCourses(true);
            const response = await axiosInstance.get("/courses/");
            let courses = response.data

            setAllCourses(courses);
            setCoursesCount(courses.length);
        } catch(error){
            console.log("Failed to fetch users:", error);
        } finally{
            setLoadingCourses(false);
        }
    }


    const fetchALLEnrollments = async()=>{
        try{
            const response = await axiosInstance.get('/enrollments/');
            setEnrollments(response.data);
        } catch (error){
            console.log(error)
        }finally{

        }
    }



    return (
        <AdminContext.Provider value={{
            usersData, loadingUsers, usersCount, adminCount, studentCount, loadingCourses, allCourses, coursesCount, enrollments, fetchUsers, fetchCourses, fetchALLEnrollments
        }}>
            {children}
        </AdminContext.Provider>
    );
}


export const useAdmin = () => useContext(AdminContext);
