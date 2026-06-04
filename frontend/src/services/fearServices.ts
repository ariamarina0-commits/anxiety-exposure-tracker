import axios from 'axios';
import type {Fear} from '../types/Fear';

const API_URL= 'http://localhost:5228/api/Fear';

export const getFears = async (): Promise<Fear[]> =>{
    const response = await axios.get<Fear[]>(API_URL);
    return response.data;
};