// services/api.js - API service for bug operations

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get all bugs with optional query parameters
 */
export const getBugs = async (params = {}) => {
  try {
    const response = await api.get('/bugs', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bugs');
  }
};

/**
 * Get a single bug by ID
 */
export const getBugById = async (id) => {
  try {
    const response = await api.get(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bug');
  }
};

/**
 * Create a new bug
 */
export const createBug = async (bugData) => {
  try {
    const response = await api.post('/bugs', bugData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create bug');
  }
};

/**
 * Update a bug by ID
 */
export const updateBug = async (id, bugData) => {
  try {
    const response = await api.put(`/bugs/${id}`, bugData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bug');
  }
};

/**
 * Update bug status
 */
export const updateBugStatus = async (id, status) => {
  try {
    const response = await api.patch(`/bugs/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bug status');
  }
};

/**
 * Delete a bug by ID
 */
export const deleteBug = async (id) => {
  try {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete bug');
  }
};

export default api;

