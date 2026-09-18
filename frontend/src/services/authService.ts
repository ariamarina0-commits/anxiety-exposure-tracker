import api from './api';

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  email: string;
};

export type CurrentUser = {
  userId: string;
  email: string;
};

export const register = async (
  credentials: RegisterRequest
): Promise<void> => {
  await api.post('/Auth/register', credentials);
};

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/Auth/login',
    credentials
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await api.get<CurrentUser>('/Auth/me');
  return response.data;
};

export const saveToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};