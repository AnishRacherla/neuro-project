// api.js — Axios client with configurable base URL for local dev or production
import axios from 'axios';

// When deployed, set VITE_API_URL in your hosting environment (e.g. Vercel/Netlify)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const API = axios.create({ baseURL: BASE_URL });

export const startSession = (device) => API.post('/start', { device });
export const getSession = (id) => API.get(`/session/${id}`);
export const submitPreSurvey = (data) => API.post('/pre-survey', data);
export const sendMessage = (participantId, message) => API.post('/chat', { participantId, message });
export const submitPostSurvey = (data) => API.post('/post-survey', data);

export const errorText = (err, fallback) => err?.response?.data?.error || fallback;
