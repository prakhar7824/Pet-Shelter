import React from 'react';
import { Link } from 'react-router-dom';

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  images: string[];
  shelterId: string;
  status: 'available' | 'pending' | 'adopted';
  createdAt: string;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'adopted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <article 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      aria-labelledby={`pet-name-${pet._id}`}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={pet.images && pet.images.length > 0 ? pet.images[0] : defaultImage}
          alt={`${pet.name} - ${pet.breed} ${pet.species}`}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 id={`pet-name-${pet._id}`} className="text-lg font-semibold text-gray-800">{pet.name}</h3>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pet.status)}`}
            role="status"
            aria-label={`Pet status: ${pet.status}`}
          >
            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
          </span>
        </div>
        
        <div className="mt-2 flex flex-wrap" role="list" aria-label="Pet details">
          <span className="text-sm text-gray-600 mr-3" role="listitem">{pet.species}</span>
          <span className="text-sm text-gray-600 mr-3" role="listitem">{pet.breed}</span>
          <span className="text-sm text-gray-600" role="listitem">{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{pet.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <Link 
            to={`/pets/${pet._id}`} 
            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            aria-label={`View details for ${pet.name}`}
          >
            View Details
          </Link>
          {pet.status === 'available' && (
            <Link 
              to={`/pets/${pet._id}/adopt`} 
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm"
              aria-label={`Start adoption process for ${pet.name}`}
            >
              Adopt Me
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PetCard; 