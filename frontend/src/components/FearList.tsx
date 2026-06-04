import { useEffect, useState } from 'react';
import { getFears } from '../services/fearServices';
import type { Fear } from '../types/Fear';

function FearList() {
  const [fears, setFears] = useState<Fear[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFears()
      .then((data) => setFears(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading fears...</p>;

  return (
    <div>
      <h2>My Fears</h2>

      {fears.length === 0 ? (
        <p>No fears added yet.</p>
      ) : (
        <ul>
          {fears.map((fear) => (
            <li key={fear.id}>
              <strong>{fear.title}</strong> — anxiety level: {fear.currentAnxietyLevel}/100
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FearList;