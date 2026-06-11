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
}