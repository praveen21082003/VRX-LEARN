import { GraduationCap, Users, ShieldUser, Contact } from 'lucide-react';
import { useAdmin } from '../../components/context/AdminContextProvider';
import EnrollmentSummary from '../../adminComponents/EnrollmentSummary';

export default function AdminDashboard({ loginUser }) {
    const { usersData, loadingUsers, usersCount, adminCount, studentCount, coursesCount } = useAdmin();

    return (
        <div className="pagebg font-semibold text-xl">
            <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2 sm:p-10">

                <div className="bg-white p-6 rounded shadow flex items-center gap-4 dark:bg-[#0A0A0A]">
                    <Users size={40} className="text-red-800" />
                    <div>
                        <h2 className="text-gray-600 dark:text-gray-400 text-lg">Total Users</h2>
                        <p className="text-3xl font-bold">{usersCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4 dark:bg-[#0A0A0A]">
                    <Contact size={40} className="text-blue-600" />
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Students</p>
                        <h2 className="text-3xl font-bold">{studentCount}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow flex items-center gap-4 dark:bg-[#0A0A0A]">
                    <ShieldUser size={40} className="text-green-700" />
                    <div>
                        <h2 className="text-gray-600 dark:text-gray-400 text-lg">Total Admins</h2>
                        <p className="text-3xl font-bold">{adminCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow flex items-center gap-4 dark:bg-[#0A0A0A]">
                    <GraduationCap size={40} className="text-indigo-900" />
                    <div>
                        <h2 className="text-gray-600 dark:text-gray-400 text-lg">Total Courses</h2>
                        <p className="text-3xl font-bold">{coursesCount}</p>
                    </div>
                </div>
            </div>
            <div className='p-5'>
                <h3 className="subtitle">Course Enrollment Summary</h3>
                <EnrollmentSummary />
            </div>
            <div className="p-5">
                <h3 className="subtitle">Admin Users</h3>
                <div className="overflow-x-auto rounded-lg shadow-sm border">
                    <table className="admintabletag">
                        <thead className="tableheader">
                            <tr>
                                <th className="tableth">Full Name</th>
                                <th className="tableth">Email Id</th>
                                <th className="tableth">User Id</th>
                                <th className="tableth">Registered At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {usersData
                                .filter((a) => a.role === "admin")
                                .map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"
                                            }`}
                                    >
                                        <td className="tabletd">{user.fullname}
                                            {user.email_id === loginUser.email_id && (
                                                <span className="ml-2 text-green-700 text-xs bg-green-100 px-2 py-1 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </td>
                                        <td className="tabletd">{user.email_id}</td>
                                        <td className="tabletd">{user.id}</td>
                                        <td className="tabletd">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
