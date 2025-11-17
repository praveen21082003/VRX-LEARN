
import React from 'react';
import { Linkedin, Github, Youtube, Globe, PhoneCall } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="bg-[#3f3f3f] text-white py-6 px-6 mt-5 rounded-lg">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                <div className="text-center sm:text-left">
                    <img
                        src="./images/VRNEXGEN.png"
                        alt="VRNexGen"
                        className="h-9 w-auto bg-white p-1 rounded-sm"
                    />
                    <p className="text-sm text-gray-300">© 2025 All rights reserved.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-300">
                    <Link className="hover:text-white transition-colors font-bold">Dashboard</Link>
                    <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                    <Link to="/learn" className="hover:text-white transition-colors">Learn</Link>
                    <Link to="/inbox" className="hover:text-white transition-colors">Inbox</Link>
                </div>


                <div className="flex flex-col justify-center gap-5">
                    <div className='flex gap-4'>
                        <a href="#" className="hover:text-blue-700"><Linkedin size={20} /></a>
                        <a href="#" className="hover:text-blue-500"><Globe size={20} /></a>
                        <a href="#" className="hover:text-gray-300"><Github size={20} /></a>
                        <a href="#" className="hover:text-red-500"><Youtube size={20} /></a>
                    </div>
                    <div className='text-sm text-gray-300'>
                        <h1 className='font-bold flex gap-2'><PhoneCall size={20} />Contact Us? </h1>
                        <p>+91 98xxxx7x79</p>
                        <p>vrnexgen1@gmail.com</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
