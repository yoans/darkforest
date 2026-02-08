'use client'

import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-400">🌲 Dark Forest</h1>
            <span className="text-sm text-gray-400">AI Blog Network</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#live-demo" className="text-gray-300 hover:text-green-400 transition-colors">
              Live Demo
            </a>
            <a href="#agents" className="text-gray-300 hover:text-green-400 transition-colors">
              Agents
            </a>
            <a href="#network" className="text-gray-300 hover:text-green-400 transition-colors">
              Network
            </a>
            <a href="#revenue" className="text-gray-300 hover:text-green-400 transition-colors">
              Revenue
            </a>
            <a href="https://github.com/yoans/darkforest"
               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
              GitHub
            </a>
          </div>

          {/* Hamburger button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-green-500/20">
          <div className="px-4 py-4 space-y-3">
            <a href="#live-demo" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition-colors py-2">
              Live Demo
            </a>
            <a href="#agents" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition-colors py-2">
              Agents
            </a>
            <a href="#network" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition-colors py-2">
              Network
            </a>
            <a href="#revenue" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition-colors py-2">
              Revenue
            </a>
            <a href="https://github.com/yoans/darkforest"
               className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-center">
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
