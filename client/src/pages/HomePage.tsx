import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';
import { fetchPets } from '../services/api';

const HomePage: React.FC = () => {
  const [featuredPets, setFeaturedPets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedPets = async () => {
      try {
        setLoading(true);
        const response = await fetchPets({ limit: 4, status: 'available' });
        setFeaturedPets(response.pets);
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured pets');
        setLoading(false);
        console.error('Error loading featured pets:', err);
      }
    };

    loadFeaturedPets();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-[80vh] flex items-center justify-center relative">
        <div className="gradient-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
              Find Your Perfect Companion
            </h1>
            <p className="text-xl md:text-2xl mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Connect with shelters and rescue organizations to find pets in need of loving homes.
              Our platform makes it easy to browse available pets and start the adoption process.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/pets"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-md transition-all transform hover:scale-105"
              >
                Browse Pets
              </Link>
              <Link
                to="/shelters"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-md transition-all transform hover:scale-105"
              >
                View Shelters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Pets</h2>
            <Link to="/pets" className="text-primary-600 hover:text-primary-800 font-semibold group flex items-center">
              See All Pets
              <svg
                className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPets.map((pet, index) => (
                <div
                  key={pet._id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PetCard pet={pet} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            How The Adoption Process Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-primary-100 text-primary-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Browse Available Pets</h3>
              <p className="text-gray-600">
                Search through our database of pets from various shelters and rescue organizations.
                Filter by species, breed, age, and location to find your perfect match.
              </p>
            </div>

            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-primary-100 text-primary-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Contact the Shelter</h3>
              <p className="text-gray-600">
                Once you find a pet you're interested in, send an adoption request directly through
                our platform. You can ask questions and arrange a visit to meet your potential new family member.
              </p>
            </div>

            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-primary-100 text-primary-600 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Complete the Adoption</h3>
              <p className="text-gray-600">
                Work with the shelter to complete the adoption process, including any necessary paperwork,
                home visits, and adoption fees. Soon, you'll be welcoming your new pet home!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-xl">Happy Adoptions</div>
            </div>
            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-xl">Partner Shelters</div>
            </div>
            <div className="text-center transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-xl">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Find Your New Best Friend?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Thousands of pets are waiting for their forever homes. Start your search today and
            help make a difference in a pet's life.
          </p>
          <Link
            to="/pets"
            className="inline-block bg-primary-600 text-white hover:bg-primary-700 font-semibold px-8 py-4 rounded-md transition-all transform hover:scale-105"
          >
            Start Your Search
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 