import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ExposureSession } from '../types/Fear';

type Props = {
  sessions: ExposureSession[];
};

function ProgressChart({ sessions }: Props) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  const chartData = [...sessions]
    .reverse()
    .map((session, index) => ({
      name: `Session ${index + 1}`,
      Before: session.anxietyBefore,
      After: session.anxietyAfter,
    }));

  return (
    <div className="chart-card">
      <h2>Progress Chart</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="Before" />
          <Line type="monotone" dataKey="After" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;