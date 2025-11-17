import React, { useRef,  } from 'react'
// import axiosInstance from '../api/axiosInstance';
import Userprofile from '../components/Userprofile';


import { Loader, BookCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    // const fileInputRef = useRef(null);
    // const navigate = useNavigate();


    // const [profile, setProfile] = useState([]);
    // const [user, setuser] = useState(() => {
    //     const storedUser = localStorage.getItem("user-authtoken");
    //     return storedUser ? JSON.parse(storedUser) : null;
    // }
    // );

    // useEffect(() => {

    //     const fetchProfileData = async () => {
    //         try {
    //             if (!user) return;

    //             const formData = new FormData();
    //             formData.append("username",user.name);

    //             const response = await axiosInstance.post("/profile", formData);
    //             console.log(response.data)
    //             setProfile(response.data);

    //         } catch (error) {
    //             alert("somethis went wrong")
    //         }
    //     }
    // })


    const Enrolledcourses = [
        { course_name: "Python Full Stack", progress: "74%", status: "In Progress" },
        { course_name: "Data Science", progress: "43%", status: "In Progress" },
        { course_name: "Java Full Stack", progress: "100%", status: "completed" },
    ];


    return (
        <div className='w-full h-screen gap-10'>
            <h1 className='pagetitle-heading'>My Profile</h1>


            <Userprofile />


            {/* Courses Enrolled */}
            <div className='bg-white h-auto mx-auto mt-10 shadow-2xl rounded-lg'>
                <div className=' p-5'>
                    <h2 className="text-2xl font-semibold mb-6">Courses Enrolled</h2>
                    <div className="overflow-x-auto items-center">
                        <table className="min-w-full divide-y-0">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                                        Course Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-300">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y-0">

                                {Enrolledcourses.map((course, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {course.course_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.progress}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {course.status === "completed" ? (<><BookCheck className='h-4' />Completed</>) : (<><Loader className='h-4' />In Progress</>)}
                                            </span>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>

                </div>
                <div className='p-5'>
                    <h2 className="text-2xl font-semibold mb-6">Summary</h2>
                    <ul>
                        <li>Total Courses Enrolled</li>

                        <li>Courses Completed</li>

                        <li>Total Hours Learned</li>

                        <li>A small progress bar or pie chart</li>
                    </ul>
                </div>
                <div className='p-5'>
                    <h2 className="text-2xl font-semibold mb-6">Achievements</h2>
                    <ul>
                        <li>Shows completed course certificates or badges earned.</li>
                        <li>Display as cards with image thumbnails and download/view buttons.</li>
                    </ul>


                </div>


            </div>

        </div>
    )
}

export default Profile
