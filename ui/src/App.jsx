import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Order from './pages/Order';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
