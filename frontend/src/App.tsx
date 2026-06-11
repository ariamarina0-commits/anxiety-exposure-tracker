import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FearList from './components/FearList';
import FearDetailsPage from './pages/FearDetailsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FearList />} />
        <Route path="/fear/:id" element={<FearDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;