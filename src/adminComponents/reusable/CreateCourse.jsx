import React, { useState } from 'react'
import { useAdmin } from '../../components/context/AdminContextProvider'
import { Grid2x2Plus, Grid2x2Check, CircleAlert } from 'lucide-react'
import WarningPopup from '../../components/WarningPopup'

function CreateCourse() {
    const { courseLoading, setSuccessMsg, successMsg, newCourse, setNewCourse, createCourse } = useAdmin();

    const [formError, setFormError] = useState({
        name: "",
        description: "",
        author: ""
    })


    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };



    function checkFormError() {
        const errors = {}
        if (!newCourse.name.trim()) {
            errors.name = "Course name cannot be empty."
        } else if (!/^[A-Z]/.test(newCourse.name.trim())) {
            errors.name = "Course name must start with an uppercase letter."
        }
        if (!newCourse.description.trim()) {
            errors.description = "Description cannot be empty"
        } else if (!/^[A-Z]/.test(newCourse.description.trim())) {
            errors.description = "Description must start with an uppercase letter.";
        }
        else {
            const wordCount = getWordCount(newCourse.description)
            if (wordCount < 15) {
                errors.description = "Description must be at least 15 words long.";
            } else if (wordCount > 20) {
                errors.description = "Description cannot exceed 20 words."
            }
        }
        if (!newCourse.author.trim()) {
            errors.author = "Author name cannot be empty."
        }

        setFormError(errors);

        return Object.keys(errors).length === 0;
    }


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setNewCourse((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = () => {
        if (!checkFormError()) {
            return;
        }
        createCourse();
    }

    return (
        <>
            <h1 className='subtitle'>Create Course</h1>
            <div className='flex flex-col lg:flex-row gap-10 justify-between border items-center p-2 sm:px-20 sm:p-5'>
                {successMsg ? (
                    <>
                        <WarningPopup
                            message={`✔️Course ${newCourse.name} has been created successfully.`}
                            show={true}
                            onClose={() => setSuccessMsg(false)}
                        />
                        <div className='h-32 w-32 bg-green-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                            <Grid2x2Check className='animate-bounce' size={60} />
                        </div>
                    </>
                ) : (
                    <div className='h-32 w-32 bg-blue-700 border rounded-full flex justify-center items-center text-white shadow-2xl'>
                        <Grid2x2Plus size={60} />
                    </div>
                )}
                <form className='grid sm:grid-cols-2 gap-1 sm:gap-5'>
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
                            title="Description must contain at least 15 words and must not exceed 20 words."
                        />
                        <p className="flex justify-end text-xs text-gray-600">
                            <span className="font-semibold">{getWordCount(newCourse.description)}/20</span>
                        </p>
                        {formError.description && <p className="flex items-center gap-1 text-xs text-red-500"><CircleAlert size={13} />{formError.description}</p>}
                    </div>
                    <div className='col-span-2 flex justify-center mt-10'>
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
        </>
    )
}

export default CreateCourse
