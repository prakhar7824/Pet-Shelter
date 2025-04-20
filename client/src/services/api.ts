/// <reference types="vite/client" />
import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for fallback when API is not available
const mockShelters = [
  {
    _id: '1',
    name: 'Happy Tails Shelter',
    description: 'A no-kill shelter dedicated to finding homes for all pets.',
    location: {
      address: '123 Pet Lane',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: '(555) 123-4567',
      email: 'info@happytails.org',
      website: 'https://happytails.org'
    },
    rating: 4.5,
    isVerified: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', caption: 'Shelter exterior' }
    ]
  },
  {
    _id: '2',
    name: 'Paws & Claws Rescue',
    description: 'Specializing in rescuing and rehoming cats and dogs.',
    location: {
      address: '456 Animal Ave',
      city: 'Petville',
      state: 'NY',
      zipCode: '67890',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    contact: {
      phone: '(555) 987-6543',
      email: 'contact@pawsandclaws.org',
      website: 'https://pawsandclaws.org'
    },
    rating: 4.2,
    isVerified: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', caption: 'Shelter interior' }
    ]
  }
];

const mockPets = [
  {
    _id: '1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    description: 'Friendly and energetic dog looking for an active family.',
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
    shelter: '1',
    status: 'available'
  },
  {
    _id: '2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: 1,
    gender: 'Female',
    description: 'Sweet and affectionate cat who loves to cuddle.',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
    shelter: '2',
    status: 'available'
  }
];

// Shelter related API calls
export const fetchShelters = async () => {
  if (USE_MOCK_DATA) {
    return { shelters: mockShelters };
  }
  
  try {
    const response = await api.get('/shelters');
    return response.data;
  } catch (error) {
    console.error('Error fetching shelters:', error);
    // Return mock data as fallback
    return { shelters: mockShelters };
  }
};

export const fetchShelterById = async (id: string) => {
  if (USE_MOCK_DATA) {
    const mockShelter = mockShelters.find(s => s._id === id);
    return mockShelter || mockShelters[0];
  }
  
  try {
    const response = await api.get(`/shelters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shelter:', error);
    // Return mock data as fallback
    const mockShelter = mockShelters.find(s => s._id === id);
    return mockShelter || mockShelters[0];
  }
};

// Pet related API calls
export const fetchPets = async (filters?: any) => {
  if (USE_MOCK_DATA) {
    return { pets: mockPets };
  }
  
  try {
    const response = await api.get('/pets', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    // Return mock data as fallback
    return { pets: mockPets };
  }
};

export const fetchPetById = async (id: string) => {
  if (USE_MOCK_DATA) {
    const mockPet = mockPets.find(p => p._id === id);
    return mockPet || mockPets[0];
  }
  
  try {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pet:', error);
    // Return mock data as fallback
    const mockPet = mockPets.find(p => p._id === id);
    return mockPet || mockPets[0];
  }
};

// User related API calls
export const login = async (credentials: { email: string; password: string }) => {
  if (USE_MOCK_DATA && credentials.email === 'test@example.com' && credentials.password === 'password') {
    const mockToken = 'mock-token-123';
    localStorage.setItem('token', mockToken);
    return { token: mockToken, user: { _id: '1', name: 'Test User', email: 'test@example.com', role: 'adopter' } };
  }
  
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  if (USE_MOCK_DATA) {
    const mockToken = 'mock-token-123';
    localStorage.setItem('token', mockToken);
    return { token: mockToken, user: { _id: '1', name: userData.name, email: userData.email, role: 'adopter' } };
  }
  
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Adoption related API calls
export const submitAdoptionRequest = async (petId: string, requestData: any) => {
  if (USE_MOCK_DATA) {
    return { success: true, message: 'Adoption request submitted successfully' };
  }
  
  try {
    const response = await api.post(`/pets/${petId}/adopt`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting adoption request:', error);
    throw error;
  }
};

export const fetchUserAdoptions = async () => {
  if (USE_MOCK_DATA) {
    return { adoptions: [] };
  }
  
  try {
    const response = await api.get('/adoptions/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user adoptions:', error);
    return { adoptions: [] };
  }
};

export default api; 