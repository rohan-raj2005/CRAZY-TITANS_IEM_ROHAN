import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Normalized API Helper Methods
export const getHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await api.get('/analytics');
  return {
    success: true,
    data: res.data.analytics || res.data.data || res.data
  };
};

export const getModels = async () => {
  const res = await api.get('/models');
  return {
    success: true,
    data: res.data.models || res.data.data || res.data
  };
};

export const getModelPerformance = async () => {
  const res = await api.get('/models/performance');
  return {
    success: true,
    data: res.data.performance || res.data.data || res.data
  };
};

export const getFeatureImportance = async () => {
  const res = await api.get('/features/importance');
  return {
    success: true,
    data: res.data.topFeatures || res.data.importance || res.data.data || res.data
  };
};

export const predictStudent = async (studentData, modelName = null) => {
  const url = modelName ? `/prediction?model=${encodeURIComponent(modelName)}` : '/prediction';
  const res = await api.post(url, studentData);
  return res.data;
};

export const getStudentHistory = async (limit = 50) => {
  const res = await api.get(`/students?limit=${limit}`);
  return {
    success: true,
    data: res.data.students || res.data.data || res.data
  };
};

export const getStudentById = async (id) => {
  const res = await api.get(`/students/${id}`);
  return {
    success: true,
    data: res.data.student || res.data.data || res.data
  };
};

export default api;
