import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">Pet Adoption Platform</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Find your new furry friend today!
        </p>
        <button className="btn btn-primary w-full">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App 