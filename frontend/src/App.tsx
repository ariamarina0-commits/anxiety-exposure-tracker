import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FearList from './components/FearList';
import FearDetailsPage from './pages/FearDetailsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main className="app">
              <header className="hero">
                <h1>Anxiety Exposure Tracker</h1>
                <p>
                  Track exposure sessions, monitor anxiety reduction, and see
                  your progress over time.
                </p>
              </header>

              <FearList />
            </main>
          }
        />

        <Route path="/fear/:id" element={<FearDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;