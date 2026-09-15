import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
  getFearById,
  deleteExposureSession,
  deleteFear,
} from '../services/fearServices';

import type { Fear, ExposureSession } from '../types/Fear';

import AddExposureSessionForm from '../components/AddExposureSessionForm';
import ProgressChart from '../components/ProgressChart';

function FearDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fear, setFear] = useState<Fear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingSessionId, setDeletingSessionId] =
    useState<number | null>(null);

  const [deleteSessionError, setDeleteSessionError] =
    useState<string | null>(null);

  const [isDeletingFear, setIsDeletingFear] = useState(false);
  const [deleteFearError, setDeleteFearError] = useState<string | null>(null);

  const handleSessionCreated = (session: ExposureSession) => {
    setFear((currentFear) => {
      if (!currentFear) return currentFear;

      return {
        ...currentFear,
        exposureSessions: [
          session,
          ...currentFear.exposureSessions,
        ],
      };
    });
  };

  const handleDeleteSession = async (sessionId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this exposure session?'
    );

    if (!confirmed) return;

    try {
      setDeletingSessionId(sessionId);
      setDeleteSessionError(null);

      await deleteExposureSession(sessionId);

      setFear((currentFear) => {
        if (!currentFear) return currentFear;

        return {
          ...currentFear,
          exposureSessions:
            currentFear.exposureSessions.filter(
              (session) => session.id !== sessionId
            ),
        };
      });
    } catch (err) {
      console.error(
        'Failed to delete exposure session:',
        err
      );

      setDeleteSessionError(
        "We couldn't delete this exposure session. Please try again."
      );
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleDeleteFear = async () => {
    if (!fear) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this fear and all its sessions?'
    );

    if (!confirmed) return;

    try {
      setIsDeletingFear(true);
      setDeleteFearError(null);

      await deleteFear(fear.id);

      navigate('/');
    } catch (err) {
      console.error('Failed to delete fear:', err);

      setDeleteFearError(
        "We couldn't delete this fear. Please try again."
      );
    } finally {
      setIsDeletingFear(false);
    }
  };

  const loadFear = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getFearById(Number(id));

      setFear(data);
    } catch (err) {
      console.error('Failed to load fear:', err);

      setError(
        "We couldn't load this fear. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFear();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button onClick={loadFear}>
          Try Again
        </button>

        <div>
          <Link to="/">← Back to fears</Link>
        </div>
      </div>
    );
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
            (sum, session) =>
              sum + session.anxietyBefore,
            0
          ) / totalSessions
        );

  const averageAfter =
    totalSessions === 0
      ? 0
      : Math.round(
          fear.exposureSessions.reduce(
            (sum, session) =>
              sum + session.anxietyAfter,
            0
          ) / totalSessions
        );

  const averageReduction =
    averageBefore - averageAfter;

  const overallImproved =
    averageReduction > 0;

  const overallWorsened =
    averageReduction < 0;

  const averageChange =
    Math.abs(averageReduction);

  const progressPercentage =
    averageBefore === 0
      ? 0
      : Math.round(
          (averageReduction / averageBefore) * 100
        );

  return (
    <div className="details-page">
      <Link to="/">← Back</Link>

      <h1>{fear.title}</h1>

      <p>{fear.description}</p>

      <div className="fear-meta">
        <span className="badge">
          Current Anxiety{' '}
          {fear.currentAnxietyLevel}/100
        </span>
      </div>

      <button
        onClick={handleDeleteFear}
        disabled={isDeletingFear}
      >
        {isDeletingFear ? 'Deleting...' : 'Delete Fear'}
      </button>

      {deleteFearError && (
      <div className="form-error" role="alert">
        {deleteFearError}
      </div>
      )}

      <div className="progress-summary">
        <div>
          <span>Total Sessions</span>
          <strong>{totalSessions}</strong>
        </div>

        <div>
          <span>Average Before</span>
          <strong>
            {averageBefore}/100
          </strong>
        </div>

        <div>
          <span>Average After</span>
          <strong>
            {averageAfter}/100
          </strong>
        </div>

        <div>
          <span>
            {overallImproved
              ? 'Average Reduction'
              : overallWorsened
                ? 'Average Increase'
                : 'Average Change'}
          </span>

          <strong>
            {overallImproved
              ? `↓ ${averageChange}/100`
              : overallWorsened
                ? `↑ ${averageChange}/100`
                : '0/100'}
          </strong>
        </div>

        <div>
          <span>
            {overallImproved
              ? 'Improvement'
              : overallWorsened
                ? 'Increase'
                : 'Change'}
          </span>

          <strong>
            {Math.abs(progressPercentage)}%
          </strong>
        </div>
      </div>

      <div className="change-indicator">
        <div className="change-labels">
          <span>Worsening</span>
          <span>No change</span>
          <span>Improvement</span>
        </div>

        <div className="change-track">
          <div className="change-center" />

          {progressPercentage !== 0 && (
            <div
              className={
                progressPercentage > 0
                  ? 'change-fill improvement'
                  : 'change-fill worsening'
              }
              style={{
                width: `${
                  Math.min(
                    Math.abs(progressPercentage),
                    100
                  ) / 2
                }%`,
              }}
            />
          )}
        </div>
      </div>

      <ProgressChart
        sessions={fear.exposureSessions}
      />

      <AddExposureSessionForm
        fearId={fear.id}
        onSessionCreated={handleSessionCreated}
      />

      {deleteSessionError && (
        <div
          className="form-error"
          role="alert"
        >
          {deleteSessionError}
        </div>
      )}

      <h2>Exposure Sessions</h2>

      {fear.exposureSessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <div className="sessions-list">
          {fear.exposureSessions.map(
            (session) => {
              const anxietyChange =
                session.anxietyAfter -
                session.anxietyBefore;

              const improved =
                anxietyChange < 0;

              const worsened =
                anxietyChange > 0;

              return (
                <div
                  key={session.id}
                  className="session-card"
                >
                  <div className="session-card-header">
                    <strong>
                      {new Date(
                        session.date
                      ).toLocaleDateString()}
                    </strong>

                    <span
                      className={
                        improved
                          ? 'anxiety-change improvement'
                          : worsened
                            ? 'anxiety-change increase'
                            : 'anxiety-change neutral'
                      }
                    >
                      {improved
                        ? `↓ ${Math.abs(
                            anxietyChange
                          )} anxiety`
                        : worsened
                          ? `↑ ${anxietyChange} anxiety`
                          : 'No change'}
                    </span>
                  </div>

                  <p>
                    <strong>
                      Before:
                    </strong>{' '}
                    {session.anxietyBefore}/100
                  </p>

                  <p>
                    <strong>
                      After:
                    </strong>{' '}
                    {session.anxietyAfter}/100
                  </p>

                  {session.notes && (
                    <p>{session.notes}</p>
                  )}

                  <button
                    onClick={() =>
                      handleDeleteSession(
                        session.id
                      )
                    }
                    disabled={
                      deletingSessionId !== null
                    }
                  >
                    {deletingSessionId ===
                    session.id
                      ? 'Deleting...'
                      : 'Delete Session'}
                  </button>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default FearDetailsPage;