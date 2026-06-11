import type { Fear } from '../types/Fear';
import { Link } from 'react-router-dom';

type FearCardProps = {
  fear: Fear;
};

function FearCard({ fear }: FearCardProps) {
  return (
    <div className="fear-card">
      <h3>{fear.title}</h3>

      {fear.description && <p>{fear.description}</p>}

      <p>
        <strong>Anxiety:</strong> {fear.currentAnxietyLevel}/100
      </p>

      <p>
        <strong>Sessions:</strong> {fear.exposureSessions?.length ?? 0}
      </p>

      <Link to={`/fear/${fear.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default FearCard;