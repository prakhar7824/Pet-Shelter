import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'adopter' | 'shelter' | 'admin';
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user for development/testing
const mockUser: User = {
  _id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'adopter',
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Use hardcoded API URL for now
  const API_URL = 'http://localhost:5000/api';
  // Assume development mode for now
  const isDevelopment = true;

  useEffect(() => {
    // Check if token exists and fetch user data
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          const response = await axios.get(`${API_URL}/auth/me`, config);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          // For development, use mock user if API fails
          if (isDevelopment) {
            setUser(mockUser);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token, API_URL, isDevelopment]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, use mock login if API fails
      if (isDevelopment && (email === 'test@example.com' && password === 'password')) {
        const mockToken = 'mock-token-123';
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token: newToken, ...userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role = 'adopter') => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, use mock register if API fails
      if (isDevelopment) {
        const mockToken = 'mock-token-123';
        localStorage.setItem('token', mockToken);
        setToken(mockToken);
        setUser({ ...mockUser, name, email, role: role as any });
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      
      const { token: newToken, ...userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 