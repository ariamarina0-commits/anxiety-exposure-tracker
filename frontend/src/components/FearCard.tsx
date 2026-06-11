import { Link } from 'react-router-dom';
import type { Fear } from '../types/Fear';

type FearCardProps = {
  fear: Fear;
};

function FearCard({ fear }: FearCardProps) {
  return (
    <div className="fear-card">
      <h3>{fear.title}</h3>

      {fear.description && <p>{fear.description}</p>}

      <div className="fear-meta">
        <span className="badge">Anxiety {fear.currentAnxietyLevel}/100</span>
        <span className="badge">
          {fear.exposureSessions?.length ?? 0} sessions
        </span>
      </div>

      <Link to={`/fear/${fear.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default FearCard;