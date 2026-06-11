import { useEffect, useState } from 'react';
import { getFears } from '../services/fearServices';
import type { Fear } from '../types/Fear';
import FearCard from './FearCard';
import AddFearForm from './AddFearForm';

function FearList() {
  const [fears, setFears] = useState<Fear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getFears()
      .then((data) => setFears(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFearCreated = (fear: Fear) => {
    setFears((currentFears) => [fear, ...currentFears]);
    setShowForm(false);
  };

  if (loading) return <p>Loading fears...</p>;

  return (
    <section>
      <div className="section-header">
        <h2>My Fears</h2>
        <button onClick={() => setShowForm((current) => !current)}>
          {showForm ? 'Cancel' : 'Add New Fear'}
        </button>
      </div>

      {showForm && <AddFearForm onFearCreated={handleFearCreated} />}

      {fears.length === 0 ? (
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