import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import Auth from './components/Auth';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Schedule from './components/Schedule';
import AvailableRooms from './components/AvailableRooms';
import SearchAvailableRooms from './components/SearchAvailableRooms';
import { login, signup } from './components/Api';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSignUp = (email, password) => {
    return signup(email, password);
  }

  const handleLogin = (email, password) => {
    login(email, password).then((response) => {
      console.log('Login response:', response);
    });
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
        <Route path="/login" element={<Auth type="login" onAuth={handleLogin} />} />
        <Route path="/signup" element={<Auth type="signup" onAuth={handleSignUp} />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/search" element={<SearchAvailableRooms />} />
        <Route path="/:day/:startTime/:endTime" element={<AvailableRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
