import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchResults({ results }) {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRequests = localStorage.getItem('roomRequests');
        if (storedRequests) {
            setRequests(JSON.parse(storedRequests));
        }
    }, []);

    return (
        <div className='min-h-screen p-6 bg-gray-100'>
            <h1 className='text-3xl font-bold text-center text-blue-600 mb-4'>
                Available Room Results
            </h1>

            {requests.length > 0 ? (
                <ul className='space-y-4'>
                    {requests.map(({ day, startTime, endTime }, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <span className='text-lg font-semibold'>
                                {day}: {startTime} - {endTime}
                            </span>
                            <button
                                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                                onClick={() => navigate(`/${day}/${startTime}/${endTime}`)}
                            >
                                View Available Rooms
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center text-gray-500'>No room requests found.</p>
            )}
        </div>
    );
}