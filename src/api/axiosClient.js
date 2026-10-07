import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

axiosClient.interceptors.request.use((config) => {
  const savedBaseUrl = localStorage.getItem('autolar-api-base-url');
  if (savedBaseUrl) config.baseURL = savedBaseUrl;
  const token = localStorage.getItem('autolar-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function normalizeApiBaseUrl(value) {
  const trimmedValue = value.trim();
  if (trimmedValue.startsWith('/') && !trimmedValue.startsWith('//')) {
    const path = trimmedValue.replace(/\/+$/, '');
    if (path === '/api' || path.endsWith('/api')) return path;
    throw new Error('The API path must end in /api.');
  }

  const url = new URL(trimmedValue);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Use an HTTP or HTTPS API address.');
  const path = url.pathname.replace(/\/$/, '').replace(/\/api$/, '');
  return `${url.origin}${path}/api`;
}

export function getApiBaseUrl() {
  return localStorage.getItem('autolar-api-base-url') || import.meta.env.VITE_API_BASE_URL || '/api';
}

export function setApiBaseUrl(value) {
  const normalized = normalizeApiBaseUrl(value);
  localStorage.setItem('autolar-api-base-url', normalized);
  axiosClient.defaults.baseURL = normalized;
  return normalized;
}

export default axiosClient;
