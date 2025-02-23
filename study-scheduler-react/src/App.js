import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />
      </Routes>
    </Router>
  );
}

export default App;
