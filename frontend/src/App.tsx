import FearList from './components/FearList';
import './index.css';

function App() {
  return (
    <main className="app">
      <header className="hero">
        <h1>Anxiety Exposure Tracker</h1>
        <p>Track fears, exposure sessions, and progress over time.</p>
      </header>

      <FearList />
    </main>
  );
}

export default App;