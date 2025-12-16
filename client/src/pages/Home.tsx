import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      title: 'e-Passport First-Time Application',
      description: 'Apply for your first South Sudan passport online',
      link: '/apply/passport-first',
    },
    {
      title: 'e-Passport Replacement',
      description: 'Replace lost, stolen, damaged, or expired passport',
      link: '/apply/passport-replacement',
    },
    {
      title: 'National ID First-Time Application',
      description: 'Apply for your first National ID card',
      link: '/apply/nationalid-first',
    },
    {
      title: 'National ID Replacement',
      description: 'Replace lost, stolen, or damaged National ID',
      link: '/apply/nationalid-replacement',
    },
    {
      title: 'National ID Correction',
      description: 'Correct errors on your existing National ID card',
      link: '/apply/nationalid-correction',
    },
    {
      title: 'Visa Application',
      description: 'Apply for entry visa to South Sudan online or on arrival',
      link: '/apply/visa',
    },
    {
      title: 'Permit Application',
      description: 'Apply for residence or work permit for investors and workers',
      link: '/apply/permit',
    },
    {
      title: 'Emergency Travel Document',
      description: 'Get emergency travel document for lost passport situations',
      link: '/apply/emergency-travel',
    },
  ];

  return (
    <div>
      {/* Hero Section - Responsive */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-green-700 text-white py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-600"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Welcome to South Sudan Immigration Portal
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 px-4">
            Apply for passports and national IDs online - Fast, Secure, and Transparent
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
              <Link to="/register" className="w-full sm:w-auto bg-yellow-400 text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-300 transition shadow-lg text-sm sm:text-base">
                Get Started
              </Link>
              <Link to="/login" className="w-full sm:w-auto border-2 border-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition text-sm sm:text-base">
                Login
              </Link>
            </div>
          )}

          {/* Search Bar - Below Buttons */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full px-5 py-3 pr-12 rounded-lg text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
              />
              <svg 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section with Search Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-900">
          {searchQuery ? 'Search Results' : 'Our Services'}
        </h2>
        <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12"></div>
        
        {(() => {
          const filteredServices = searchQuery
            ? services.filter(service =>
                service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : services;

          return filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <Link
                  key={index}
                  to={user ? service.link : '/login'}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 border-blue-600 hover:border-yellow-400 group"
                >
                  <h3 className="text-lg font-semibold mb-2 text-blue-900 group-hover:text-green-700 transition">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-600">Try searching for "passport" or "national ID"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear search
              </button>
            </div>
          );
        })()}
      </div>

      {/* Benefits Section - Responsive */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-900">Why Use Our Portal?</h2>
          <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Fast Processing</h3>
              <p className="text-gray-600">Submit applications online and track status in real-time</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Secure & Transparent</h3>
              <p className="text-gray-600">Your data is protected with bank-level security</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-400">
              <h3 className="text-xl font-semibold mb-2 text-blue-900">Apply Anywhere</h3>
              <p className="text-gray-600">No need to visit offices - apply from anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Responsive */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-blue-900">How It Works</h2>
        <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '1', title: 'Create Account' },
            { step: '2', title: 'Choose Service' },
            { step: '3', title: 'Fill Application' },
            { step: '4', title: 'Make Payment' },
            { step: '5', title: 'Collect Document' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-lg border-2 border-yellow-400">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-700">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
