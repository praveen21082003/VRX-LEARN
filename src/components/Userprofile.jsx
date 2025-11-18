import React, { useEffect, useRef, useState } from 'react'
import { User } from 'lucide-react';

function Userprofile({ user }) {

    const emailRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const el = emailRef.current;
        if (!el) return;

        // Check if email width > container width
        setIsOverflowing(el.scrollWidth > el.clientWidth);
    }, [user.email_id]);

    return (
        <div className="flex w-[40%] sm:w-auto gap-1 items-center">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <User size={18} />
            </div>

            {/* Name + Email */}
            <div className="overflow-hidden sm:w-auto">
                <p className="text-sm font-semibold text-gray-800">
                    {user.fullname}
                </p>

                {/* Email with conditional marquee */}
                <p
                    ref={emailRef}
                    className={`
                        text-xs text-gray-500 dark:text-gray-400 -mt-1 whitespace-nowrap
                        ${isOverflowing ? "animate-marquee" : ""}
                    `}
                >
                    {user.email_id}
                </p>
            </div>
        </div>
    );
}

export default Userprofile;










// import React, { useState } from 'react'
// import { SquarePen, X, Save } from 'lucide-react';

// function Userprofile() {

//     const featchedUserDetails = {
//         url: "https://i.pinimg.com/736x/7e/46/c6/7e46c6d2798eff446b365c5246f4c9ca.jpg",
//         firstName: "Praveen",
//         lastName: "Kumar",
//         email: "praveen@example.com",
//         phone: "7981930348",
//         current_loacation: "Chennai, Tamil Nadu, India",
//         designation: "Full Stack Developer",
//         summary: "Aspiring Python Full Stack Developer with a strong foundation in Python, Django, React.js, and SQL. Experienced in developing web applications with a focus on clean, efficient, and user-friendly design. Built a chess coaching system with real-time move evaluation and an online pet grooming services website with appointment scheduling features. Passionate about problem-solving, web development, and creating seamless user experiences. Always eager to learn and work on innovative projects.",
//         technical_skills: ["React", "Python", "LangChain", "Tailwindcss"],
//         education:
//         {
//             degree: "B.tech",
//             college_name: "MS Ramaiah Ramaiah University",
//             stream: "CSE",
//             year_of_passout: 2024
//         },
//         year_of_experience: 1,
//         months_of_experience: 6,
//         current_CTC: 1.5,
//         current_company: "VRNEXGEN",
//         expected_CTC: 2.5,
//         linked_url: "https://linked.com-#praveenkumar-g3cfed3vh4bn4m",
//         github_url: "https://github.com-#praveenkumar-igh6v5v3j2k2k3",
//         certification_url: ["Publication certification", "Hackathon participation", "IBM"],
//     };


//     const [isEdit, setIsEdit] = useState(false);
//     const [userDetails, setUserDetails] = useState(featchedUserDetails);
//     const words = (userDetails.summary).trim().split(/\s+/).length;
//     // const [role, setRole] = useState("student");
//     const [skillInput, setSkillInput] = useState("");

//     if (words.length <= 70) {
//         alert("only 70 words all");
//     }

//     const handleChange = (e) => {
//         setUserDetails({
//             ...userDetails,
//             [e.target.name]: e.target.value
//         })
//     }

//     const handleAddSkill = () => {
//         if (!skillInput.trim()) return;
//         setUserDetails({
//             ...userDetails,
//             technical_skills: [...userDetails.technical_skills, skillInput.trim()]
//         });

//         setSkillInput("");
//     }

//     const handleRemoveSkill = (index) => {
//         setUserDetails({
//             ...userDetails,
//             technical_skills: userDetails.technical_skills.filter((_, i) => i !== index)
//         });
//     };




//     return (
//         <div className="bg-gradient-to-b from-white to-indigo-100 p-2 rounded-lg shadow-[0_-6px_12px_rgba(0,0,0,0.05)]">
//             <h2 className="text-2xl font-semibold mb-6">User Details</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">

//                 <div className="relative flex justify-center">
//                     <div className="relative h-28 w-28 sm:h-64 sm:w-64 border-4 border-white bg-slate-400 rounded-full shadow-lg flex items-center justify-center">
//                         <img
//                             src={userDetails.url}
//                             alt="Profile"
//                             className="w-auto h-full rounded-full object-cover"
//                         />
//                         <button className='absolute h-4 w-4 sm:h-10 sm:w-10 rounded-full bg-white text-black flex items-center justify-center bottom-2 right-2 sm:bottom-4 sm:right-4 shadow-md cursor-pointer'>
//                             <SquarePen className='scale-50' />
//                         </button>
//                     </div>
//                 </div>

//                 {/* User Details Information */}
//                 <div className="grid grid-cols-2 gap-10 p-2 sm:scale-100">
//                     <div>
//                         <label className="user-details-lables">First Name:</label>
//                         <input
//                             type="text"
//                             name="firstName"
//                             value={userDetails.firstName || ""}
//                             placeholder='Enter your firstname'
//                             className="input-field"
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="user-details-lables">Last Name:</label>
//                         <input
//                             type="text"
//                             name="lastName"
//                             className="input-field"
//                             value={userDetails.lastName || ""}
//                             placeholder='Enter your lastname'
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="user-details-lables">Email:</label>
//                         <input
//                             type="email"
//                             name="email"
//                             className="input-field"
//                             value={userDetails.email}
//                             placeholder='email'
//                             disabled
//                         />
//                     </div>

//                     <div>
//                         <label className="user-details-lables">Phone:</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             className="input-field"
//                             placeholder="Enter your phonenumber"
//                             // pattern="^\+?[0-9\s\-]{7,15}$"
//                             value={userDetails.phone || ""}
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="user-details-lables">Current Location:</label>
//                         <input
//                             type="text"
//                             name="current_loacation"
//                             className="input-field"
//                             value={userDetails.current_loacation || ""}
//                             placeholder='Enter your location'
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div>
//                         <label className="user-details-lables">Designation:</label>
//                         <input
//                             type="text"
//                             name="designation"
//                             className="input-field"
//                             value={userDetails.designation || ""}
//                             placeholder='Enter your designation'
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='py-5 px-2 w-full'>
//                 <label className="user-details-lables">Summary:</label>
//                 <textarea
//                     name="summary"
//                     value={userDetails.summary || ""}
//                     placeholder='Write short summary up to 100 words...'
//                     className='input-field h-auto'
//                     rows="5"
//                     disabled={!isEdit}
//                     onChange={handleChange}

//                 />
//                 <p className='text-xs text-gray-300'>{words}/70 words</p>
//             </div>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//                 <div className='flex flex-col gap-2 sm:py-0 '>
//                     <label className="user-details-lables">Technical Skills</label>

//                     {/* Show skills as chips */}
//                     <div className=" md:h-40 input-field overflow-y-auto">
//                         <div className='flex flex-wrap gap-2'>
//                             {userDetails.technical_skills.map((skill, index) => (
//                                 <span key={index} className="h-7 flex items-center gap-2 bg-gradient-to-r from-pink-900 to-pink-700 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800 transition">
//                                     {skill}
//                                     {isEdit &&
//                                         <button className='relative border-none' onClick={() => handleRemoveSkill(index)}>
//                                             <X size={15} />
//                                         </button>}
//                                 </span>

//                             ))}
//                         </div>
//                     </div>
//                     {isEdit && (
//                         <div className="flex gap-2">
//                             <input
//                                 type="text"
//                                 className="input-field w-1/2"
//                                 placeholder="Add a skill (ex: React)"
//                                 value={skillInput}
//                                 onChange={(e) => setSkillInput(e.target.value)}
//                             />

//                             <button
//                                 className="px-3 py-1 bg-white text-black rounded"
//                                 onClick={handleAddSkill}
//                             >
//                                 Add
//                             </button>
//                         </div>
//                     )}
//                 </div>
//                 <div>
//                     <label className="user-details-lables">Highest Education Qualification :</label>
//                     <div className='grid grid-cols-2 gap-2 py-7'>
//                         <div>
//                             <label className="user-details-lables">Degree:</label>
//                             <input
//                                 type="text"
//                                 name="degree"
//                                 className="input-field"
//                                 value={userDetails.education.degree || ""}
//                                 placeholder='Enter your degree'
//                                 disabled={!isEdit}
//                             />
//                         </div>
//                         <div>
//                             <label className="user-details-lables">College Name:</label>
//                             <input
//                                 type="text"
//                                 name="college_name"
//                                 className="input-field"
//                                 value={userDetails.education.college_name || ""}
//                                 placeholder='Enter your college name'
//                                 disabled={!isEdit}
//                             />
//                         </div>
//                         <div>
//                             <label className="user-details-lables">Stream:</label>
//                             <input
//                                 type="text"
//                                 name="stream"
//                                 className="input-field"
//                                 value={userDetails.education.stream || ""}
//                                 placeholder='Enter your stream'
//                                 disabled={!isEdit}
//                             />
//                         </div>
//                         <div>
//                             <label className="user-details-lables">Year of passout:</label>
//                             <input
//                                 type="text"
//                                 name="year_of_passout"
//                                 className="input-field"
//                                 value={userDetails.education.year_of_passout || ""}
//                                 placeholder='Enter your year of passout'
//                                 disabled={!isEdit}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div>
//                 <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 py-5'>
//                     <div>
//                         <label className="user-details-lables">year of experience:</label>
//                         <select
//                             name="year_of_experience"
//                             className="input-field"
//                             value={userDetails.year_of_experience || ""}
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         >
//                             <option value="">Select Experience</option>
//                             <option value="0">0</option>
//                             <option value="1">1</option>
//                             <option value="2">2</option>
//                             <option value="3">3</option>
//                             <option value="4">4</option>
//                             <option value="5">5</option>
//                             <option value="6">6</option>
//                             <option value="7">7</option>
//                             <option value="8">8</option>
//                             <option value="9">9</option>
//                             <option value="10">10</option>
//                             <option value="11">11</option>
//                             <option value="above">above 11</option>


//                         </select>

//                     </div>
//                     <div>
//                         <label className="user-details-lables">months of experience:</label>
//                         <select
//                             name="months_of_experience"
//                             className="input-field"
//                             value={userDetails.months_of_experience || ""}
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         >
//                             <option value="">Select Experience</option>
//                             <option value="0">0</option>
//                             <option value="1">1</option>
//                             <option value="2">2</option>
//                             <option value="3">3</option>
//                             <option value="4">4</option>
//                             <option value="5">5</option>
//                             <option value="6">6</option>
//                             <option value="7">7</option>
//                             <option value="8">8</option>
//                             <option value="9">9</option>
//                             <option value="10">10</option>
//                             <option value="11">11</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="user-details-lables">current CTC:</label>
//                         <input
//                             type="text"
//                             name="current_CTC"
//                             className="input-field"
//                             value={userDetails.current_CTC || ""}
//                             placeholder='Enter your currentCTC'
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div>
//                         <label className="user-details-lables">current_company:</label>
//                         <input
//                             type="text"
//                             name="current_company"
//                             className="input-field"
//                             value={userDetails.current_company || ""}
//                             placeholder='Enter your year of current company'
//                             disabled={!isEdit}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className='py-10'>

//                 {/* LinkedIn */}
//                 <div className='flex gap-5 items-center'>
//                     <label className="user-details-lables w-40">LinkedIn:</label>
//                     {isEdit ? (
//                         <input
//                             type="text"
//                             name="linked_url"
//                             className="input-field flex-1"
//                             value={userDetails.linked_url || ""}
//                             onChange={handleChange}
//                         />
//                     ) : (
//                         <p className='break-all'>{userDetails.linked_url}</p>
//                     )}
//                 </div>

//                 {/* GitHub */}
//                 <div className='flex gap-5 items-center mt-3'>
//                     <label className="user-details-lables w-40">Github:</label>
//                     {isEdit ? (
//                         <input
//                             type="text"
//                             name="github_url"
//                             className="input-field flex-1"
//                             value={userDetails.github_url || ""}
//                             onChange={handleChange}
//                         />
//                     ) : (
//                         <p className='break-all'>{userDetails.github_url}</p>
//                     )}
//                 </div>

//                 {/* Certifications (array → show as tags OR comma separated) */}
//                 <div className='flex gap-5 items-start mt-3'>
//                     <label className="user-details-lables w-40">Certifications:</label>

//                     {isEdit ? (
//                         <textarea
//                             name="certification_url"
//                             className="input-field flex-1"
//                             rows={3}
//                             value={userDetails.certification_url.join(", ")}   // convert array → text
//                             onChange={(e) =>
//                                 setUserDetails({
//                                     ...userDetails,
//                                     certification_url: e.target.value.split(",").map(s => s.trim())
//                                 })
//                             }
//                         />
//                     ) : (
//                         <div className="flex flex-wrap gap-2">
//                             {userDetails.certification_url.map((c, i) => (
//                                 <span key={i} className="bg-gradient-to-r from-pink-900 to-pink-700 text-white px-3 py-1 rounded-full text-sm">
//                                     {c}
//                                 </span>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//             </div>

//             <div className='flex justify-center p-10'>
//                 {
//                     isEdit ?
//                         <button className='edit-save-btns' onClick={() => setIsEdit(false)}>
//                             <Save size={20} />save
//                         </button>
//                         :
//                         <button className='edit-save-btns' onClick={() => setIsEdit(true)}>
//                             <SquarePen size={15} />Edit
//                         </button>
//                 }
//             </div>

//         </div>
//     )
// }

// export default Userprofile;
