import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import Auth from './components/Auth';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Schedule from './components/Schedule';
import AvailableRooms from './components/AvailableRooms';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const login = (email) => {
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    setUserEmail(null);
  };

  return (
    <Router>
      <NavBar userEmail={userEmail} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth type="login" onAuth={login} />} />
        <Route path="/signup" element={<Auth type="signup" onAuth={login} />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/:day/:startTime/:endTime" element={<AvailableRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
