import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFearById } from '../services/fearServices';
import type { Fear, ExposureSession } from '../types/Fear';
import AddExposureSessionForm from '../components/AddExposureSessionForm';
import ProgressChart from '../components/ProgressChart';

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

  const totalSessions = fear.exposureSessions.length;

  const averageBefore =
    totalSessions === 0
      ? 0
      : Math.round(
          fear.exposureSessions.reduce(
            (sum, session) => sum + session.anxietyBefore,
            0
          ) / totalSessions
        );

  const averageAfter =
    totalSessions === 0
      ? 0
      : Math.round(
          fear.exposureSessions.reduce(
            (sum, session) => sum + session.anxietyAfter,
            0
          ) / totalSessions
        );

  const averageReduction = averageBefore - averageAfter;
  const progressPercentage = averageBefore === 0 ? 0 : Math.round((averageReduction / averageBefore) * 100);

  return (
    <div className="details-page">
      <Link to="/">← Back</Link>

      <h1>{fear.title}</h1>

      <p>{fear.description}</p>

      <div className="fear-meta">
            <span className="badge">
                Current Anxiety {fear.currentAnxietyLevel}/100
            </span>
        </div>

      <div className="progress-summary">
        <div>
          <span>Total Sessions</span>
          <strong>{totalSessions}</strong>
        </div>

        <div>
          <span>Average Before</span>
          <strong>{averageBefore}/100</strong>
        </div>

        <div>
          <span>Average After</span>
          <strong>{averageAfter}/100</strong>
        </div>

        <div>
          <span>Average Reduction</span>
          <strong>{averageReduction}/100</strong>
        </div>
        <div>
            <span>Improvement</span>
            <strong>{progressPercentage}%</strong>
        </div>

      </div>

        <div className="progress-bar">
            <div
                className="progress-fill"
                style={{
                width: `${Math.max(progressPercentage, 0)}%`,
                }}
            />
        </div>
        <ProgressChart sessions={fear.exposureSessions} />
      <AddExposureSessionForm
        fearId={fear.id}
        onSessionCreated={handleSessionCreated}
      />

      <h2>Exposure Sessions</h2>

      {fear.exposureSessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <div className="sessions-list">
  {fear.exposureSessions.map((session) => {
    const reduction = session.anxietyBefore - session.anxietyAfter;

    return (
      <div key={session.id} className="session-card">
        <div className="session-card-header">
            <strong>
                {new Date(session.date).toLocaleDateString()}
            </strong>

            <span className="reduction">
                -{reduction} anxiety
            </span>
        </div>
        <p>
            <strong>Before:</strong> {session.anxietyBefore}/100
        </p>
        <p>
            <strong>After:</strong> {session.anxietyAfter}/100
        </p>
        {session.notes && <p>{session.notes}</p>}
        </div>
        );
    })}
    </div>
      )}
    </div>
    

  );
}

export default FearDetailsPage;