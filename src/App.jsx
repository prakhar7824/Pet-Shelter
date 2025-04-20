import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Pet Adoption Platform</h1>
        <p className="text-gray-700 mb-6">
          Find your new furry friend today!
        </p>
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App 