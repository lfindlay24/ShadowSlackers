import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center w-96">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                    Find a study Room
                </h1>
                <p className="text-gray-600 mb-6">
                    Search for available study rooms on campus
                </p>
                <input
                    type="text"
                    placeholder="Search for a room..."
                    className="w-full p-2 mb-4 border rounded"
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Search
                </button>
                <div className="mt-4">
                    <p className='text-sm'>New here?</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-500 underline"
                    >
                        Sign Up
                    </button>
                    <p className='text-sm mt-2'>Already have an account?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 underline"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}