import axios from 'axios';
import type { Fear } from '../types/Fear';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5228';
const API_URL = `${API_BASE_URL}/api/Fear`;

export type CreateFearRequest ={
    title: string;
    description?: string;
    currentAnxietyLevel: number;
};

export const getFears = async(): Promise<Fear[]> =>{
    const response = await axios.get<Fear[]>(API_URL);
    return response.data;
};

export const createFear = async (fear: CreateFearRequest): Promise<Fear> =>{
    const response = await axios.post<Fear>(API_URL,fear);
    return response.data;
};

export const getFearById = async (id: number) : Promise<Fear> =>{
    const response = await axios.get<Fear>(`${API_URL}/${id}`);
    return response.data;
}

export type CreateExposureSessionRequest ={
    fearId: number;
    anxietyBefore: number;
    anxietyAfter: number;
    notes?: string;
};

export const createExposureSession = async( session: CreateExposureSessionRequest) =>{
    const response = await axios.post(`${API_BASE_URL}/api/ExposureSession`, session);
    return response.data;
};

export const deleteExposureSession = async (sessionId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/api/ExposureSession/${sessionId}`);
};

export const deleteFear = async(fearId: number): Promise<void> =>{
    await axios.delete(`${API_URL}/${fearId}`);
};