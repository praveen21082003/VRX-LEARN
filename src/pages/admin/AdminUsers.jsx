import React, { useMemo, useState } from 'react'
import { Trash2, UserSearch, UserCheck, UserPlus, CircleAlert, ShieldUser, ChevronLeft, ChevronRight, Delete } from 'lucide-react';
import { useAdmin } from '../../components/context/AdminContextProvider';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import axiosInstance from '../../api/axiosInstance';
import DialogueBox from '../../components/DialogueBox';
import WarningPopup from '../../components/WarningPopup';


function AdminUsers() {
    const { usersData, fetchUsers, pageNumber, setPageNumber, loadingUsers } = useAdmin();
    const page = usersData.page || 1;
    const size = usersData.size || 5;
    const total = usersData.total || 0;
    const currentCount = usersData.items?.length || 0;



    const start = (page - 1) * size + 1;
    const end = (page - 1) * size + currentCount;
    const rowsCount = end - start + 1;
    const rowHeight = 56;
    // const dynamicHeight = rowsCount * rowHeight;


    const [selectedDelete, setSelectedDelete] = useState([]);


    const [searchUser, setSearchUser] = useState("");
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [showMultipleDeleteBox, setShowMultipleDeleteBox] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [userId, setUserId] = useState(0);
    const [searchedUserData, setSearchedUserData] = useState(null);
    const [SearchedUser, setSearchedUser] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [searchloading, setSearchLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        fullname: "",
        email_id: "",
        role: "",
        password: "",
        confirm_password: "",
    })
    const [error, setError] = useState({
        code: null,
        message: "",
        detail: "",
        show: false
    });
    const [formError, setFormError] = useState({
        fullname: "",
        email_id: "",
        role: "",
        password: "",
        confirm_password: "",
        search_input: "",
    })

    const filteredUserData = useMemo(() => {
        return usersData.items.filter(user =>
            user.fullname.toLowerCase().includes(searchUser.toLowerCase()) ||
            user.email_id.toLowerCase().includes(searchUser.toLowerCase()) ||
            String(user.id).includes(searchUser)
        );
    }, [searchUser, usersData]);

    const handleDelete = (user) => {

        if (selectedDelete.length !== 0) {
            setShowMultipleDeleteBox(true);
        }
        else {
            setShowDeleteBox(true);
            setUserId(user.id);
            setSearchedUserData(null);
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function CheckFormError() {
        const errors = {};

        if (!newUser.fullname.trim()) {
            errors.fullname = "Name cannot be empty"
        } else if (!/^[A-Z]/.test(newUser.fullname.trim())) {
            errors.fullname = "Name must starts with uppercase letter"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!newUser.email_id.trim()) {
            errors.email_id = "Email cannot be empty"
        } else if (!emailRegex.test(newUser.email_id)) {
            errors.email_id = "Please enter a valid email address."
        }

        if (!newUser.role.trim()) {
            errors.role = "Role cannot be empty"
        }

        if (!newUser.password.trim()) {
            errors.password = "Password cannot be empty"
        }

        if (!newUser.confirm_password.trim()) {
            errors.confirm_password = "Confirm password cannot be empty"
        }

        setFormError(errors);

        return Object.keys(errors).length === 0;
    }


    async function handleSubmit() {

        if (!CheckFormError()) {
            return;
        }

        try {
            setFormLoading(true);
            const response = await axiosInstance.post('/users/', newUser);
            if (response.status === 201) {
                fetchUsers();
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1200);
                setNewUser({
                    fullname: "",
                    email_id: "",
                    role: "",
                    password: "",
                    confirm_password: "",
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
            setFormLoading(false);
        }
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

    const handleNext = () => {
        if (pageNumber < usersData.pages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePrev = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);

        }
    };



    return (
        <div className='pagebg h-auto'>

            {showDeleteBox &&
                <ConfirmationDialog
                    message="Delete this user permanently?"
                    msg="⚠️ The user account will be permanently removed."
                    buttonName="Delete"
                    closeButtonName="Cancel"
                    loadingMsg="Deleting..."
                    endpoint="/users"
                    actionId={userId}
                    onSuccess={() => { setShowDeleteBox(false); fetchUsers(); }}
                    onClose={() => setShowDeleteBox(false)}
                />
            }
            {showMultipleDeleteBox &&
                <ConfirmationDialog
                    message="Delete users permanently?"
                    msg="⚠️ The selected user accounts will be permanently removed."
                    buttonName="Delete "
                    loadingMsg="Deleting..."
                    closeButtonName="Cancle"
                    endpoint="/users"
                    actionId={selectedDelete}
                    onSuccess={() => { setShowDeleteBox(false); fetchUsers(); setSelectedDelete([]); }}
                    onClose={() => setShowMultipleDeleteBox(false)}
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
            <div className='p-1 sm:p-5'>
                <h1 className='subtitle'>Create User</h1>
                <div className='flex flex-col lg:flex-row justify-evenly gap-10 items-center border p-2 sm:p-5'>

                    {successMsg ? (
                        <>
                            <WarningPopup
                                message={`✔️User with email ${newUser.email_id} has been created successfully.`}
                                show={true}
                                onClose={() => setSuccessMsg(false)}
                            />
                            <div className='h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                                {newUser.role === "admin" ? <ShieldUser className='animate-bounce' size={60} /> : <UserCheck className='animate-bounce' size={60} />}
                            </div>
                        </>
                    ) : (
                        <div className='h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                            <UserPlus size={60} />
                        </div>
                    )}

                    <form className='grid grid-cols-2 gap-1 sm:gap-5'>

                        <div>
                            <label>FullName*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='enter name'
                                required
                                name='fullname'
                                value={newUser.fullname}
                                onChange={handleOnChange}
                            />
                            {formError.fullname && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.fullname}</p>}
                        </div>

                        <div>
                            <label>Email Id*</label>
                            <input
                                className='input-field'
                                type='text'
                                placeholder='enter email ID'
                                required
                                name='email_id'
                                value={newUser.email_id}
                                onChange={handleOnChange}
                            />
                            {formError.email_id && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.email_id}</p>}
                        </div>

                        <div className='col-span-2'>
                            <label>Role*</label>
                            {formError.role && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.role}</p>}
                            <select
                                className='input-field'
                                required
                                name='role'
                                value={newUser.role}
                                onChange={handleOnChange}
                            >
                                <option value="">-select-</option>
                                <option value="trainee">Trainee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label>Password*</label>
                            <input
                                className='input-field'
                                type='password'
                                placeholder='enter password'
                                required
                                name='password'
                                value={newUser.password}
                                onChange={handleOnChange}
                            />
                            {formError.password && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.password}</p>}
                        </div>

                        <div>
                            <label>Confirm Password*</label>
                            <input
                                className='input-field'
                                type='password'
                                placeholder='confirm your password'
                                required
                                name='confirm_password'
                                value={newUser.confirm_password}
                                onChange={handleOnChange}
                            />
                            {formError.confirm_password && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.confirm_password}</p>}
                        </div>

                        <div className='col-span-2 flex justify-center mt-5'>
                            <button
                                className='bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold transition delay-100 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110'
                                onClick={handleSubmit}
                                type='button'
                            >
                                {formLoading ? "Creating.." : "Create"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="py-10 sm:p-5">
                <h1 className="subtitle mb-4">Search User</h1>


                <div className="">
                    {formError.search_input && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.search_input}</p>}
                    <div className="flex flex-row gap-4">
                        <div className="relative w-full lg:w-1/2">
                            <UserSearch
                                className="icon-insearchbar"
                                size={18}
                            />
                            <input
                                className="input-field px-10"
                                type="number"
                                placeholder="Enter User ID"
                                value={SearchedUser}
                                onChange={(e) => setSearchedUser(e.target.value)}
                            />
                        </div>



                        <button
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4 text-white font-semibold transition-all"
                            type="button"
                            onClick={() => {
                                if (!SearchedUser.trim()) {
                                    setFormError(prev => ({
                                        ...prev,
                                        search_input: "Please enter a User ID to search.",
                                    }));
                                    return;
                                }
                                setFormError(prev => ({ ...prev, search_input: "" }));

                                fetchUser(SearchedUser);
                            }}

                        >
                            Search
                        </button>
                    </div>



                    <div className="admin-search">
                        {searchedUserData && !Array.isArray(searchedUserData) && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">User Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="text-base font-medium">{searchedUserData.fullname}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Email ID</p>
                                        <p className="text-base font-medium">{searchedUserData.email_id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="text-base font-medium capitalize">{searchedUserData.role}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="text-base font-medium">{searchedUserData.id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="text-base font-medium">
                                            {new Date(searchedUserData.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold shadow-sm transition-all flex items-center gap-2"
                                        onClick={() => handleDelete(searchedUserData)}
                                    >
                                        <Trash2 size={18} /> Delete User
                                    </button>
                                </div>
                            </>
                        )}
                        {searchedUserData === null && (
                            <p className="text-center mt-4 text-red-600 font-medium">
                                Search to view or delete user.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sm:p-5">
                <h3 className="subtitle mb-3">All Users</h3>
                <div className="flex flex-col lg:flex-row justify-between items-center lg:mb-3 gap-2 sm:gap-10">
                    <div className="relative flex gap-5 w-full lg:w-1/2">
                        <UserSearch
                            className="icon-insearchbar"
                            size={18}
                        />
                        <input
                            className="input-field h-8 px-10"
                            type="text"
                            placeholder="Search (e.g., name, user ID, email)"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                        <button className='bg-red-600 rounded-lg px-5 text-white font-semibold' type='button' onClick={() => setSearchUser("")}>Clear</button>
                    </div>



                    <div className='flex justify-around items-center p-2 border-x border-t lg:border-none gap-5'>
                        <span className='text-sm text-gray-500'>{start}–{end} of {total}</span>
                        <button className='bg-gray-100 rounded-lg p-1' onClick={handlePrev} disabled={pageNumber === 1}>
                            <ChevronLeft size={20} />
                        </button>

                        <span className='text-sm text-gray-500'>{pageNumber} page of {usersData.pages}</span>

                        <button className='bg-gray-100 rounded-lg p-1' onClick={handleNext} disabled={pageNumber === usersData.pages}>
                            <ChevronRight size={20} />
                        </button>

                    </div>
                </div>


                <div className="overflow-x-auto rounded-lg h-full shadow-sm border">
                    <table className="admintabletag">
                        <thead className="tableheader border-t">
                            <tr>
                                <th className="tableth">
                                    <div className='w-8 h-8 items-center flex justify-center'>
                                        {
                                            selectedDelete.length !== 0 &&
                                            <button className='p-2 hover:bg-black/10 rounded-full font-semibold' type='button' onClick={handleDelete}><Trash2 size={19} /></button>
                                        }
                                    </div>
                                </th>
                                <th className="tableth">Full Name</th>
                                <th className="tableth">Email Id</th>
                                <th className="tableth">User Id</th>
                                <th className="tableth">Role</th>
                                <th className="tableth">Registered At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingUsers ? (
                                <>
                                    {Array.from({ length: rowsCount }).map((_, i) =>
                                        <tr key={i}>
                                            <td className="p-3">
                                                <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 w-64 bg-gray-300 animate-pulse rounded"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 w-5 bg-gray-300 animate-pulse rounded"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 w-10 bg-gray-300 animate-pulse rounded"></div>
                                            </td>
                                            <td className="p-3">
                                                <div className="h-4 w-28 bg-gray-300 animate-pulse rounded"></div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ) : (
                                <>
                                    {filteredUserData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <div
                                                    className="flex justify-center tabletd py-4 text-gray-500 font-semibold"
                                                >
                                                    No users found for this search.
                                                </div>

                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUserData.map((user, index) => (
                                            <tr
                                                key={user.id}
                                                className={`hover:bg-red-100  dark:hover:bg-gray-800 transition 
                                                ${index % 2 === 0 ? "bg-white dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}
                                                `}
                                            >
                                                <td className="tabletd">
                                                    <span className='w-8 h-8 items-center hover:bg-black/20 rounded-full  p-2 flex justify-center'>
                                                        <input
                                                            className='w-[17px] h-[17px] accent-[#840227]'
                                                            type="checkbox"
                                                            value={user.id}
                                                            checked={selectedDelete.includes(user.id)}
                                                            onChange={(e) => {
                                                                const id = user.id;

                                                                setSelectedDelete((prev) =>
                                                                    e.target.checked
                                                                        ? [...prev, id]
                                                                        : prev.filter((item) => item !== id)
                                                                );
                                                            }}
                                                        />
                                                    </span>
                                                </td>

                                                <td className="tabletd">{user.fullname}</td>
                                                <td className="tabletd">{user.email_id}</td>
                                                <td className="tabletd">{user.id}</td>
                                                <td className="tabletd">{user.role}</td>
                                                <td className="tabletd">
                                                    <div className={`${searchUser && "flex justify-between"}`}>
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                        {searchUser && (
                                                            <button onClick={() => handleDelete(user)}>
                                                                <Trash2 className="text-red-700" size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </>)}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminUsers
