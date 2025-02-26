import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">
                    Study Finder
                </Link>

                <button
                    className="text-white md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>

                <div
                    className={`md:flex space-x-6 ${
                        isOpen ? "block" : "hidden"
                    } md:block`}
                >
                    <Link to='/' className='text-white hover:underline'>Home</Link>
                    <Link to='/login' className='text-white hover:underline'>Login</Link>
                    <Link to='/signup' className='text-white hover:underline'>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}