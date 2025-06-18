// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Menu, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Top Nav Bar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white bg-opacity-70 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg sm:text-xl">
          <Users />
          <span>ReunionTrips</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex gap-6">
          <button
            onClick={() => handleNavigate('/')}
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('/planner')}
            className="text-gray-700 hover:text-blue-600"
          >
            Plan a Trip
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button className="sm:hidden" onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 px-6 py-4 transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                <Users />
                <span>ReunionTrips</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleNavigate('/')}
                className="text-gray-800 hover:text-blue-600 text-left"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('/planner')}
                className="text-gray-800 hover:text-blue-600 text-left"
              >
                Plan a Trip
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
