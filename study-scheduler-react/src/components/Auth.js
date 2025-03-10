import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from './Api';
import { AuthContext } from './AuthContext';

export default function Auth({ type }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        try {
            const promise = type === 'signup' ? signup(formData.email, formData.password) : login(formData.email, formData.password);

            promise.then((response) => {
                if (response.message === "Item added successfully" || response.message === "Login successful") {
                    loginUser(formData.email);
                    navigate('/');
                } else {
                    setError("Authentication failed. Please try again.");
                }
            }).catch((error) => {
                setError("Authentication failed. Please try again.");
            })

        } catch (err) {
            setError("An error occured. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {type === 'login' ? 'Login' : 'Sign Up'}
                </h2>

                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        {type === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    {type === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => navigate(type === 'login' ? '/signup' : '/login')}
                        className="text-blue-500 underline"
                    >
                        {type === 'login' ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}