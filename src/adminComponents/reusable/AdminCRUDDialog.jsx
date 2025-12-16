import React from 'react'
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import CreateCourse from './CreateCourse';
import CreateModule from './CreateModule';
import CreateResource from './CreateResource';

function AdminCRUDDialog({ action, onClose, courseId, courseName, moduleId, moduleName }) {
    
    return ReactDOM.createPortal(
        <div className='dark:text-gray-200'>
            {action === 'createCourses' &&
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
                    <div className='relative bg-white dark:bg-[#0b1222] p-5 max-h-[80%] overflow-x-auto'>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <CreateCourse />
                    </div>
                </div>
            }
            {action === 'createModules' &&
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
                    <div className='relative bg-white dark:bg-[#0b1222] p-5'>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <CreateModule courseId={courseId} courseName={courseName} />
                    </div>
                </div>
            }
            {action === 'createResources' &&
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
                    <div className='relative bg-white dark:bg-[#0b1222] p-5'>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <CreateResource moduleId={moduleId} moduleName={moduleName} />
                    </div>
                </div>
            }

        </div>, document.getElementById('root') || document.body
    )
}

export default AdminCRUDDialog
