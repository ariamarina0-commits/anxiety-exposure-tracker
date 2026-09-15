import { useState } from 'react';
import { createFear } from '../services/fearServices';
import type { Fear } from '../types/Fear';

type AddFearFormProps = {
  onFearCreated: (fear: Fear) => void;
};

function AddFearForm({ onFearCreated }: AddFearFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentAnxietyLevel, setCurrentAnxietyLevel] = useState(50);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError('Please enter a fear title.');
      return;
    }

    if (currentAnxietyLevel < 0 || currentAnxietyLevel > 100) {
      setError('Anxiety level must be between 0 and 100.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const newFear = await createFear({
        title: trimmedTitle,
        description: trimmedDescription,
        currentAnxietyLevel,
      });

      onFearCreated(newFear);

      setTitle('');
      setDescription('');
      setCurrentAnxietyLevel(50);
    } catch (err) {
      console.error('Failed to create fear:', err);
      setError("We couldn't save your fear. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="add-fear-form" onSubmit={handleSubmit}>
      <h3>Add New Fear</h3>

      <input
        type="text"
        placeholder="Fear Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isSaving}
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        disabled={isSaving}
      />

      <label>
        Anxiety Level: {currentAnxietyLevel} / 100

        <input
          type="range"
          min="0"
          max="100"
          value={currentAnxietyLevel}
          onChange={(event) =>
            setCurrentAnxietyLevel(Number(event.target.value))
          }
          disabled={isSaving}
        />
      </label>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Fear'}
      </button>
    </form>
  );
}

export default AddFearForm;