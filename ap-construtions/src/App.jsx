import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Tailwind UI Test 🚀
        </h1>

        <p className="text-center text-gray-600 mb-8">
          This is a second Tailwind design using gradients, blur and shadows.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}

export default App

