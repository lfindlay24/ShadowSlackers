import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const generateTimeSlots = () => {
    return Array.from({ length: 24 }, (_, i) => {
        const hour = Math.floor(i / 2) + 8; // Start at 8 AM
        const minute = i % 2 === 0 ? "00" : "30";
        const nextMinute = minute === "00" ? "30" : "00";
        const nextHour = minute === "30" ? hour + 1 : hour;
        const period = hour >= 12 ? "PM" : "AM";
        const nextPeriod = nextHour >= 12 ? "PM" : "AM";

        const formattedHour = hour > 12 ? hour - 12 : hour;
        const formattedNextHour = nextHour > 12 ? nextHour - 12 : nextHour;

        return {
            label: `${formattedHour}:${minute} ${period} - ${formattedNextHour}:${nextMinute} ${nextPeriod}`,
            value: hour + (minute === "30" ? 0.5 : 0)
        };
    });
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Schedule() {
    const [schedule, setSchedule] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedSchedule = localStorage.getItem('roomSearchSchedule');
        if (storedSchedule) {
            setSchedule(JSON.parse(storedSchedule));
        }
    }, []);

    useEffect(() => {
        if (Object.keys(schedule).length > 0) {
            localStorage.setItem("roomSearchSchedule", JSON.stringify(schedule));
        }
    }, [schedule]);

    const toggleSlot = (day, timeSlot) => {
        setSchedule((prev) => {
            const updatedSchedule = { ...prev, [`${day}-${timeSlot.value}`]: !prev[`${day}-${timeSlot.value}`] };
            return updatedSchedule;
        });
    };

    const clearSchedule = () => {
        setSchedule({});
        localStorage.removeItem('schedule');
    };

    const findRoomRequests = () => {
        const requests = [];

        days.forEach((day) => {
            const times = generateTimeSlots()
                .map((slot => slot.value))
                .filter((time => schedule[`${day}-${time}`]));

            if (times.length > 0) {
                let startTime = times[0];
                let endTime = times[0];

                for (let i = 1; i < times.length; i++) {
                    if (times[i] === endTime + 0.5) {
                        endTime = times[i];
                    } else {
                        requests.push({ day, startTime, endTime: endTime + 0.5});
                        startTime = times[i];
                        endTime = times[i];
                    }
                }
                requests.push({ day, startTime, endTime: endTime + 0.5 });
            }
        });

        if (requests.length > 0) {
            const { day, startTime, endTime } = requests[0];
            navigate(`/${day}/${startTime}/${endTime}`);
        } else {
            alert("No room requests found. Please select time slots.");
        }
    }

    const hours = generateTimeSlots();

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className='text-3xl font-bold text-center text-blue-600 mb-4'>
                Select Times You Need A Room
            </h1>

            <div className='overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-300'>
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className='p-2 border border-gray-300'>Time</th>
                            {days.map((day) => (
                                <th key={day} className='p-2 border border-gray-300'>
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map((timeSlot) => (
                            <tr key={timeSlot.value} className='text-center'>
                                <td className='p-2 border border-gray-300 font-semibold'>{timeSlot.label}</td>
                                {days.map((day) => (
                                    <td
                                        key={`${day}-${timeSlot.value}`}
                                        className={`p-2 border border-gray-300 cursor-pointer ${
                                            schedule[`${day}-${timeSlot.value}`] ? 'bg-green-500 text-white' : 'bg-white'
                                        }`}
                                        onClick={() => toggleSlot(day, timeSlot)}
                                    >
                                        {schedule[`${day}-${timeSlot.value}`] ? 'Need Room' : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex gap-4 mt-4'>
                <button 
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    onClick={findRoomRequests}
                >
                    Search Available Rooms
                </button>

                <button
                    className='mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    onClick={clearSchedule}
                >
                    Clear Schedule
                </button>
            </div>
        </div>
    );
}