import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import FearDetailsPage from './pages/FearDetailsPage';
import './index.css';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import BreathingPage from './pages/BreathingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/fear/:id"
          element={<FearDetailsPage />}
        />
        <Route
          path="/breathing"
          element={<BreathingPage />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;