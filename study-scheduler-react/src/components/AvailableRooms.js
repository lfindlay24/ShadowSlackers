import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'https://rpq5ewwiy6.execute-api.us-east-2.amazonaws.com/dev';

const formatTime = (time) => {
    const hour = Math.floor(time);
    const minute = time % 1 === 0.5 ? "30" : "00";
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:${minute} ${period}`;
};

const AvailableRooms = () => {
    const { day, startTime, endTime } = useParams();
    const navigate = useNavigate();
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            try {
                const response = await fetch(`${API_URL}/getAvailableClass`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        day,
                        timeStart: parseFloat(startTime),
                        timeEnd: parseFloat(endTime)
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    setAvailableRooms(data.availableRooms);
                } else {
                    throw new Error(data.message || 'Failed to fetch rooms');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableRooms();
    }, [day, startTime, endTime]);

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100'>
            <h1 className='text-3xl font-bold text-center text-blue-600 mb-4'>
                Available Rooms
            </h1>
            <p className='text-center text-lg'>
                Showing available rooms for <strong>{day}</strong> from <strong>{formatTime(parseFloat(startTime))}</strong> to <strong>{formatTime(parseFloat(endTime))}</strong>.
            </p>
            <div className='mt-6'>
                {loading ? (
                    <p className='text-center text-gray-500'>Loading...</p>
                ) : error ? (
                    <p className='text-center text-red-500'>{error}</p>
                ) : availableRooms.length > 0 ? (
                    <ul className='max-w-lg mx-auto bg-white shadow-md rounded-lg p-4'>
                        {availableRooms.map((room) => (
                            <li
                                key={room}
                                className='p-3 border-b last:border-b-0 text-lg text-center'
                            >
                                Room <strong>{room}</strong> from <strong>{formatTime(parseFloat(startTime))}</strong> to <strong>{formatTime(parseFloat(endTime))}</strong>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-center text-gray-500'>No available rooms for this time slot.</p>
                )}
            </div>

            <div className='mt-6 text-center'>
                <button
                    onClick={() => navigate('/search')}
                    className='bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 text-lg'
                >
                    Back to Search
                </button>
            </div>
        </div>
    );
}

export default AvailableRooms;