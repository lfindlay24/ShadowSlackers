import { useParams, useNavigate } from 'react-router-dom';

const mockRooms = [
    { roomNumber: "010", day: "Monday", availableFrom: 8, until: 10.5 },
    { roomNumber: "102", day: "Monday", availableFrom: 9, until: 12 },
    { roomNumber: "203", day: "Tuesday", availableFrom: 13, until: 15 },
    { roomNumber: "305", day: "Wednesday", availableFrom: 10, until: 12.5 },
    { roomNumber: "312", day: "Friday", availableFrom: 8, until: 11 }
]

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

    const availableRooms = mockRooms.filter(
        (room) =>
            room.day === day &&
            room.availableFrom <= parseFloat(startTime) &&
            room.until >= parseFloat(endTime)
    );

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100'>
            <h1 className='text-3xl font-bold text-center text-blue-600 mb-4'>
                Available Rooms
            </h1>
            <p className='text-center text-lg'>
                Showing available rooms for <strong>{day}</strong> from <strong>{formatTime(parseFloat(startTime))}</strong> to <strong>{formatTime(parseFloat(endTime))}</strong>.
            </p>
            <div className='mt-6'>
                {availableRooms.length > 0 ? (
                    <ul className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-4">
                        {availableRooms.map((room) => (
                            <li
                                key={room.roomNumber}
                                className='p-3 border-b last:border-b-0 text-lg text-center'
                            >
                                Room <strong>{room.roomNumber}</strong> (Available:{" "}
                                {formatTime(room.availableFrom)} - {formatTime(room.until)})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-center text-gray-500'>
                        No available rooms for this time slot.
                    </p>
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