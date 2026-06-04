export type ExposureSession = {
  id: number;
  fearId: number;
  date: string;
  anxietyBefore: number;
  anxietyAfter: number;
  notes?: string;
};

export type Fear = {
  id: number;
  title: string;
  description?: string;
  currentAnxietyLevel: number;
  createdAt: string;
  exposureSessions: ExposureSession[];
};