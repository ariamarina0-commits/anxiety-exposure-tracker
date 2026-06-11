import axios from 'axios';
import type { Fear } from '../types/Fear';

const API_URL ='http://localhost:5228/api/Fear';

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
    const response = await axios.post('http://localhost:5228/api/ExposureSession', session);
    return response.data;
};

export const deleteExposureSession = async (sessionId: number): Promise<void> => {
  await axios.delete(`http://localhost:5228/api/ExposureSession/${sessionId}`);
};