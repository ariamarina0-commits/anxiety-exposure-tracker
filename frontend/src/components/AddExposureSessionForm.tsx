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

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newSession = await createExposureSession({
      fearId,
      anxietyBefore,
      anxietyAfter,
      notes,
    });

    onSessionCreated(newSession);

    setAnxietyBefore(50);
    setAnxietyAfter(30);
    setNotes('');
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
          onChange={(e) => setAnxietyBefore(Number(e.target.value))}
        />
      </label>

      <label>
        Anxiety after: {anxietyAfter}/100
        <input
          type="range"
          min="0"
          max="100"
          value={anxietyAfter}
          onChange={(e) => setAnxietyAfter(Number(e.target.value))}
        />
      </label>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Save Session</button>
    </form>
  );
}

export default AddExposureSessionForm;