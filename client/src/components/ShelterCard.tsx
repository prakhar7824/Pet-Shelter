import React from 'react';
import { Link } from 'react-router-dom';

interface Shelter {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  logo?: string;
  website?: string;
}

interface ShelterCardProps {
  shelter: Shelter;
}

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter }) => {
  const defaultLogo = 'https://via.placeholder.com/100x100?text=Shelter';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img
              src={shelter.logo || defaultLogo}
              alt={`${shelter.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{shelter.name}</h3>
            <p className="text-sm text-gray-600">
              {shelter.address.city}, {shelter.address.state}
            </p>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-500 line-clamp-3">{shelter.description}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {shelter.phone}
            </p>
          </div>
          <div>
            <p className="text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {shelter.email}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link 
            to={`/shelters/${shelter._id}`} 
            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            View Details
          </Link>
          
          <Link 
            to={`/shelters/${shelter._id}/pets`} 
            className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-sm"
          >
            See Pets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShelterCard; 