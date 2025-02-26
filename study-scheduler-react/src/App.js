import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import Auth from './components/Auth';
import Home from './components/Home';
import NavBar from './components/NavBar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth type="login" onAuth={login} />} />
        <Route path="/signup" element={<Auth type="signup" onAuth={login} />} />
      </Routes>
    </Router>
  );
}

export default App;
