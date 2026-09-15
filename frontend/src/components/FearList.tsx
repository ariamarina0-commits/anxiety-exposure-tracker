import { useEffect, useState } from 'react';
import { getFears } from '../services/fearServices';
import type { Fear } from '../types/Fear';
import FearCard from './FearCard';
import AddFearForm from './AddFearForm';

function FearList() {
  const [fears, setFears] = useState<Fear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFears = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getFears();
      setFears(data);
    } catch (err) {
      console.error('Failed to load fears:', err);
      setError("We couldn't load your fears. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFears();
  }, []);

  const handleFearCreated = (fear: Fear) => {
    setFears((currentFears) => [fear, ...currentFears]);
    setShowForm(false);
  };

  if (loading) {
    return <p>Loading fears...</p>;
  }

  return (
    <section>
      <div className="section-header">
        <h2>My Fears</h2>

        {!error && (
          <button onClick={() => setShowForm((current) => !current)}>
            {showForm ? 'Cancel' : 'Add New Fear'}
          </button>
        )}
      </div>

      {showForm && (
        <AddFearForm onFearCreated={handleFearCreated} />
      )}

      {error ? (
        <div className="error-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={loadFears}>Try Again</button>
        </div>
      ) : fears.length === 0 ? (
        <p>No fears added yet.</p>
      ) : (
        <div className="fear-grid">
          {fears.map((fear) => (
            <FearCard key={fear.id} fear={fear} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FearList;