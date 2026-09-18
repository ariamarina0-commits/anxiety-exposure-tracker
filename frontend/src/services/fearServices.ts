import api from './api';
import type { Fear } from '../types/Fear';

export type CreateFearRequest = {
  title: string;
  description?: string;
  currentAnxietyLevel: number;
};

export const getFears = async (): Promise<Fear[]> => {
  const response = await api.get<Fear[]>('/Fear');
  return response.data;
};

export const createFear = async (
  fear: CreateFearRequest
): Promise<Fear> => {
  const response = await api.post<Fear>('/Fear', fear);
  return response.data;
};

export const getFearById = async (
  id: number
): Promise<Fear> => {
  const response = await api.get<Fear>(`/Fear/${id}`);
  return response.data;
};

export type CreateExposureSessionRequest = {
  fearId: number;
  anxietyBefore: number;
  anxietyAfter: number;
  notes?: string;
};

export const createExposureSession = async (
  session: CreateExposureSessionRequest
) => {
  const response = await api.post('/ExposureSession', session);
  return response.data;
};

export const deleteExposureSession = async (
  sessionId: number
): Promise<void> => {
  await api.delete(`/ExposureSession/${sessionId}`);
};

export const deleteFear = async (
  fearId: number
): Promise<void> => {
  await api.delete(`/Fear/${fearId}`);
};