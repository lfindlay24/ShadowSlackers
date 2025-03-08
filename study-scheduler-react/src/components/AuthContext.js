import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    const loginUser = (email) => {
        localStorage.setItem('userEmail', email);
        setUserEmail(email);
    };

    const logoutUser = () => {
        localStorage.removeItem('userEmail');
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ userEmail, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}