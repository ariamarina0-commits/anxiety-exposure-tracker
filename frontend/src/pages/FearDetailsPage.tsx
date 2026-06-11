import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFearById } from '../services/fearServices';
import type { Fear, ExposureSession } from '../types/Fear';
import AddExposureSessionForm from '../components/AddExposureSessionForm';


function FearDetailsPage() {
  const { id } = useParams();

  const [fear, setFear] = useState<Fear | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSessionCreated = (session: ExposureSession) => {
    setFear((currentFear) => {
        if (!currentFear) return currentFear;

            return {
                ...currentFear,
                exposureSessions: [session, ...currentFear.exposureSessions],
            };
        });
    };

  useEffect(() => {
    if (!id) return;

    getFearById(Number(id))
      .then((data) => setFear(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!fear) {
    return <p>Fear not found.</p>;
  }

  return (
    <div className="details-page">
      <Link to="/">← Back</Link>

      <h1>{fear.title}</h1>

      <p>{fear.description}</p>

      <p>
        <strong>Current Anxiety:</strong>{' '}
        {fear.currentAnxietyLevel}/100
      </p>
        <AddExposureSessionForm
            fearId={fear.id}
            onSessionCreated={handleSessionCreated}
        />
      <h2>Exposure Sessions</h2>

      {fear.exposureSessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <div>
          {fear.exposureSessions.map((session) => (
            <div key={session.id} className="session-card">
              <p>
                <strong>Before:</strong>{' '}
                {session.anxietyBefore}
              </p>

              <p>
                <strong>After:</strong>{' '}
                {session.anxietyAfter}
              </p>

              <p>{session.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FearDetailsPage;