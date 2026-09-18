import FearList from '../components/FearList';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-account">
          <span>{user?.email}</span>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Log out
          </button>
        </div>

        <h1>Anxiety Exposure Tracker</h1>

        <p>
          Track exposure sessions, monitor anxiety reduction, and see
          your progress over time.
        </p>
      </header>

      <FearList />
    </main>
  );
}

export default HomePage;