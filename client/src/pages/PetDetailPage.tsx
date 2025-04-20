import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPetById, fetchShelterById, submitAdoptionRequest } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<any | null>(null);
  const [shelter, setShelter] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showAdoptionForm, setShowAdoptionForm] = useState<boolean>(false);
  const [adoptionMessage, setAdoptionMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPetDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const petData = await fetchPetById(id);
        setPet(petData);
        
        if (petData.shelterId) {
          const shelterData = await fetchShelterById(petData.shelterId);
          setShelter(shelterData);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load pet details');
        setLoading(false);
        console.error('Error loading pet details:', err);
      }
    };

    loadPetDetails();
  }, [id]);

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/pets/${id}` } });
      return;
    }
    
    if (!adoptionMessage.trim()) {
      setError('Please provide a message for the shelter');
      return;
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      await submitAdoptionRequest(id!, {
        message: adoptionMessage,
      });
      
      setSuccessMessage('Your adoption request has been submitted successfully! The shelter will contact you soon.');
      setShowAdoptionForm(false);
      setAdoptionMessage('');
      setSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit adoption request');
      setSubmitting(false);
    }
  };

  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Pet not found'}</p>
        </div>
        <Link to="/pets" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          Back to Pets
        </Link>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/600x400?text=No+Image+Available';
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/pets" className="text-primary-600 hover:text-primary-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pets
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left: Pet Images */}
            <div className="md:w-1/2 p-4">
              <div className="relative pb-[75%] overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={pet.images && pet.images.length > 0 ? pet.images[activeImageIndex] : defaultImage}
                  alt={pet.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {pet.images && pet.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {pet.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`cursor-pointer h-20 overflow-hidden rounded-md border-2 ${
                        index === activeImageIndex ? 'border-primary-600' : 'border-transparent'
                      }`}
                      onClick={() => handleImageClick(index)}
                    >
                      <img src={image} alt={`${pet.name} - Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right: Pet Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    pet.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : pet.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Species:</span>
                  <p className="font-medium text-gray-900">{pet.species}</p>
                </div>
                <div>
                  <span className="text-gray-500">Breed:</span>
                  <p className="font-medium text-gray-900">{pet.breed}</p>
                </div>
                <div>
                  <span className="text-gray-500">Age:</span>
                  <p className="font-medium text-gray-900">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Gender:</span>
                  <p className="font-medium text-gray-900">{pet.gender}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <p className="font-medium text-gray-900">{pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date Added:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">About {pet.name}</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-line">{pet.description}</p>
              </div>
              
              {pet.status === 'available' && (
                <div className="mt-8">
                  <button
                    onClick={() => setShowAdoptionForm(!showAdoptionForm)}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
                  >
                    {showAdoptionForm ? 'Cancel' : 'Adopt Me!'}
                  </button>
                </div>
              )}
              
              {showAdoptionForm && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Adoption Request</h3>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleAdoptionSubmit}>
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message to the Shelter
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                        placeholder="Tell the shelter why you'd be a great owner for this pet..."
                        value={adoptionMessage}
                        onChange={(e) => setAdoptionMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors ${
                          submitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {submitting ? 'Submitting...' : 'Submit Adoption Request'}
                      </button>
                      <button
                        type="button"
                        className="ml-3 text-gray-600 hover:text-gray-800"
                        onClick={() => setShowAdoptionForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          {/* Shelter Information */}
          {shelter && (
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shelter Information</h2>
              
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200">
                  <img
                    src={shelter.logo || 'https://via.placeholder.com/100?text=Shelter'}
                    alt={shelter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{shelter.name}</h3>
                  <p className="text-gray-600">
                    {shelter.address.city}, {shelter.address.state}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {shelter.address.street}, {shelter.address.city}, {shelter.address.state} {shelter.address.zipCode}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {shelter.phone}
                  </p>
                  
                  <p className="text-gray-600 flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {shelter.email}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/shelters/${shelter._id}`}
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  View Shelter Profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage; 