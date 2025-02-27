import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchAvailableRooms = () => {
    const navigate = useNavigate();
    const [day, setDay] = useState('Monday');
    const [startTime, setStartTime] = useState(8);
    const [endTime, setEndTime] = useState(9);

    const handleSearch = () => {
        if (parseFloat(startTime) >= parseFloat(endTime)) {
            alert('Start time must be before end time.');
            return;
        }
        navigate(`/${day}/${startTime}/${endTime}`);
    };

    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const time = 8 + i * 0.5;
        const hour = Math.floor(time); // Start at 8 AM
        const minute = time % 1 === 0.5 ? "30" : "00";
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour;

        return {
            value: time,
            label: `${formattedHour}:${minute} ${period}`
        };
    });

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6'>
            <h1 className='text-3xl font-bold text-blue-600 mb-4'>Find Available Rooms</h1>

            <div className='bg-white p-6 shadow-lg rounded-lg w-full max-w-lg'>
                <label className="block mb-2 font-semibold">Select Day:</label>
                <select
                    className='w-full p-2 border rounded mb-4'
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>

                <label className='block mb-2 font-semibold'>Start Time:</label>
                <select
                    className='w-full p-2 border rounded mb-4'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                >
                    {timeOptions.map((time) => (
                        <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                </select>

                <label className='block mb-2 font-semibold'>End Time:</label>
                <select
                    className='w-full p-2 border rounded mb-4'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                >
                    {timeOptions.map((time) => (
                        <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                </select>

                <button
                    className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default SearchAvailableRooms;