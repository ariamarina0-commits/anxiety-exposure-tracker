import { useState } from 'react';
import { createExposureSession } from '../services/fearServices';
import type { ExposureSession } from '../types/Fear';

type Props = {
  fearId: number;
  onSessionCreated: (session: ExposureSession) => void;
};

function AddExposureSessionForm({ fearId, onSessionCreated }: Props) {
  const [anxietyBefore, setAnxietyBefore] = useState(50);
  const [anxietyAfter, setAnxietyAfter] = useState(30);
  const [notes, setNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (anxietyBefore < 0 || anxietyBefore > 100) {
      setError('Anxiety before must be between 0 and 100.');
      return;
    }

    if (anxietyAfter < 0 || anxietyAfter > 100) {
      setError('Anxiety after must be between 0 and 100.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const newSession = await createExposureSession({
        fearId,
        anxietyBefore,
        anxietyAfter,
        notes: notes.trim(),
      });

      onSessionCreated(newSession);

      setAnxietyBefore(50);
      setAnxietyAfter(30);
      setNotes('');
    } catch (err) {
      console.error('Failed to create exposure session:', err);
      setError("We couldn't save your exposure session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="add-fear-form" onSubmit={handleSubmit}>
      <h3>Add Exposure Session</h3>

      <label>
        Anxiety before: {anxietyBefore}/100
        <input
          type="range"
          min="0"
          max="100"
          value={anxietyBefore}
          onChange={(event) =>
            setAnxietyBefore(Number(event.target.value))
          }
          disabled={isSaving}
        />
      </label>

      <label>
        Anxiety after: {anxietyAfter}/100
        <input
          type="range"
          min="0"
          max="100"
          value={anxietyAfter}
          onChange={(event) =>
            setAnxietyAfter(Number(event.target.value))
          }
          disabled={isSaving}
        />
      </label>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        disabled={isSaving}
        maxLength={1000}
      />

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Session'}
      </button>
    </form>
  );
}

export default AddExposureSessionForm;