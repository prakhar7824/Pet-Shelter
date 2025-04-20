import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">PetShelter</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Home
                </Link>
                <Link to="/pets" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Pets
                </Link>
                <Link to="/shelters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Shelters
                </Link>
                <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  About
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                    Dashboard
                  </Link>
                  <div className="relative ml-3">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                        onClick={logout}
                      >
                        Logout
                      </button>
                      <Link to="/profile" className="ml-2 flex items-center">
                        <span className="mr-2">{user?.name}</span>
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-primary-600 text-sm font-bold">
                              {user?.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium border border-transparent hover:bg-primary-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-primary-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/pets"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pets
          </Link>
          <Link
            to="/shelters"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shelters
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-primary-700">
          {isAuthenticated ? (
            <div className="px-2 space-y-1">
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 