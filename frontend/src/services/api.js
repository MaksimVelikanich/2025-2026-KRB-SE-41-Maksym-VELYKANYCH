import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (email, password) =>
  api.post('/auth/register', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const predictSingle = (transactionData) =>
  api.post('/predict/', transactionData);

export const predictBatch = (formData) =>
  api.post('/predict/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getHistory = () =>
  api.get('/predict/history');

export default api;