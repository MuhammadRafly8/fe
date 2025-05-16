import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const login = async (email: string, password: string): Promise<unknown> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    // Make sure token is being stored correctly
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token stored successfully');
      
      // Store token expiration time (assuming backend sends expiration or using default 24h)
      const expiresIn = response.data.expiresIn || 86400; // 24 hours in seconds
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem('tokenExpiration', expirationTime.toString());
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Check if token is valid and not expired
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  if (!token) return false;
  
  // If we have expiration time, check if token is expired
  if (tokenExpiration) {
    const now = new Date().getTime();
    if (now > parseInt(tokenExpiration)) {
      // Token expired, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      return false;
    }
  }
  
  return true;
};

// Get token with validation
export const getAuthToken = async (): Promise<string | null> => {
  if (!isTokenValid()) {
    try {
      // Try to refresh the token
      return await refreshToken();
    } catch (error) {
      // If refresh fails, redirect to login
      window.location.href = '/login';
      return null;
    }
  }
  
  return localStorage.getItem('token');
};

// Add a function to refresh the token
export const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Update expiration time
      const expiresIn = response.data.expiresIn || 86400;
      const expirationTime = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      
      return response.data.token;
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    console.error('Token refresh error:', error);
    // Force logout on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    window.location.href = '/login';
    throw error;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiration');
  window.location.href = '/login';
};