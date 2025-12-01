import { GraduationCap, Users, ShieldUser, Contact } from 'lucide-react';
import { useAdmin } from '../../components/context/AdminContextProvider';
// import EnrollmentsChart from '../../adminComponents/EnrollmentsChart';

export default function AdminDashboard() {
    const { usersData, loadingUsers,usersCount, adminCount, studentCount, coursesCount} = useAdmin();

    return (
        <div className="bg-white rounded-lg font-semibold text-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10">

                <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                    <Users size={40} className="text-red-800" />
                    <div>
                        <h2 className="text-gray-600 text-lg">Total Users</h2>
                        <p className="text-3xl font-bold">{usersCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                    <Contact size={40} className="text-blue-600" />
                    <div>
                        <p className="text-gray-500 text-lg">Students</p>
                        <h2 className="text-3xl font-bold">{studentCount}</h2>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                    <ShieldUser size={40} className="text-green-700" />
                    <div>
                        <h2 className="text-gray-600 text-lg">Total Admins</h2>
                        <p className="text-3xl font-bold">{adminCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow flex items-center gap-4">
                    <GraduationCap  size={40} className="text-indigo-900" />
                    <div>
                        <h2 className="text-gray-600 text-lg">Total Courses</h2>
                        <p className="text-3xl font-bold">{coursesCount}</p>
                    </div>
                </div>
            </div>
            {/* <div className='p-10'>
                <EnrollmentsChart/>
            </div> */}
            <div className="p-5">
                <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
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
                                        className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`}
                                    >
                                        <td className="tabletd">{user.fullname}</td>
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
