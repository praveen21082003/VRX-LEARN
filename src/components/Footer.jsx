
import React from 'react';
import { Linkedin, Github, Youtube, Globe, PhoneCall, Mail } from 'lucide-react';
import { Link } from "react-router-dom";

function Footer() {
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
                    <Link to="/dashboard" className="hover:text-white transition-colors font-bold">Dashboard</Link>
                    <Link to="/courses" className="hover:text-white transition-colors font-bold">Courses</Link>
                    <Link to="/learn" className="hover:text-white transition-colors font-bold">Learn</Link>
                    <Link to="/inbox" className="hover:text-white transition-colors font-bold">Inbox</Link>
                </div>


                <div className="flex flex-col justify-center gap-5">
                    <div className='flex gap-4'>
                        <a href="https://www.linkedin.com/company/vrnexgen/" className="hover:text-blue-700" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                        <a href="https://vrnexgen1.com" className="hover:text-blue-500" target="_blank" rel="noopener noreferrer"><Globe size={20} /></a>
                        <a href="#" className="hover:text-gray-300" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                        <a href="https://www.youtube.com/@VRNeXGen1" className="hover:text-red-500" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
                    </div>
                    <div className='text-sm text-gray-300'>
                        <h1 className='font-bold flex gap-2'>Contact Us? </h1>
                        <a href="tel:+919150139611" className="flex items-center hover:text-blue-500">
                            <PhoneCall size={20} className="mr-1" />
                            +91 91501 39611
                        </a>
                        <a href="mailto:vrnexgen1@gmail.com" className="flex items-center hover:text-blue-500">
                            <Mail size={20} className="mr-1" />
                            vrnexgen1@gmail.com
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
