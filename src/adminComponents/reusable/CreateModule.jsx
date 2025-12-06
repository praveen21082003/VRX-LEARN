import React, { useState, useEffect } from 'react'
import { PackagePlus, PackageCheck, CircleAlert } from 'lucide-react'
import { useAdmin } from '../../components/context/AdminContextProvider'
import WarningPopup from '../../components/WarningPopup';

function CreateModule({ courseId, courseName }) {
    const { successMsg, newModule, setSuccessMsg, createModule, moduleLoading, setNewModule } = useAdmin();


    const [formError, setFormError] = useState({
        name: "",
    })

    function checkFormError() {
        const errors = {}
        if (!newModule.name.trim()) {
            errors.name = "module name cannot be empty."
        } else if (!/^[A-Z]/.test(newModule.name.trim())) {
            errors.name = "module name must start with an uppercase letter."
        }
        setFormError(errors);

        return Object.keys(errors).length === 0;
    }

    useEffect(() => {
        setNewModule(prev => ({
            ...prev,
            course_id: courseId
        }));
    }, [courseId]);

    const handleOnChange = (e) => {
        setNewModule(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = () => {
        if (!checkFormError()) return;
        createModule();
    };


    return (
        <>
            <h1 className='subtitle'>Create Module</h1>
            <div className='flex flex-col lg:flex-row gap-10 justify-between border items-center p-1 sm:p-5'>
                {successMsg ? (
                    <>
                        <WarningPopup
                            message={`✔️Module ${newModule.name} has been created successfully.`}
                            show={true}
                            onClose={() => setSuccessMsg(false)}
                        />
                        <div className='h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                            <PackageCheck className='animate-bounce' size={60} />
                        </div>
                    </>
                ) : (
                    <div className='h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                        <PackagePlus size={60} />
                    </div>
                )}
                <form className='grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-5'>
                    <div>
                        <label>Course Name*</label>
                        <input
                            className='input-field bg-gray-100 cursor-not-allowed'
                            type='text'
                            value={courseName}
                            disabled
                        />
                    </div>

                    <div>
                        <label>Module Name*</label>
                        <input
                            className='input-field'
                            type='text'
                            placeholder='Enter module name'
                            required
                            name='name'
                            value={newModule.name}
                            onChange={handleOnChange}
                        />
                        {formError.name && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.name}</p>}
                    </div>
                    
                    <div className='sm:col-span-2 flex justify-center'>
                        <button
                            className='bg-gray-700 rounded-lg px-3 py-2 text-white font-semibold hover:-translate-y-1 hover:scale-110'
                            onClick={handleSubmit}
                            type='button'
                        >
                            {moduleLoading ? "Creating.." : "Create Module"}
                        </button>
                    </div>

                </form>

            </div>
        </>
    )
}

export default CreateModule
