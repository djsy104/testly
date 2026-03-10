import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem('token');

    if (
      status === 401 &&
      token &&
      !error.config.url.includes('/api/auth/login') &&
      !error.config.url.includes('/api/auth/register')
    ) {
      localStorage.removeItem('token');
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);
