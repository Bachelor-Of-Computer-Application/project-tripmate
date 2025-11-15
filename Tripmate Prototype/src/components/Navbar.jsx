// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Map, CalendarPlus, Home } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/Trips" className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
          <Map className="w-6 h-6" /> TripMate
        </Link>

        <div className="hidden md:flex space-x-8 text-sm font-semibold text-gray-700">
          <Link
            to="/Trips"
            className={`hover:text-blue-700 transition ${isActive('/Trips') ? 'text-blue-700 underline underline-offset-4' : ''}`}
          >
            My Trips
          </Link>
          <Link
            to="/planner"
            className={`hover:text-blue-700 transition ${isActive('/planner') ? 'text-blue-700 underline underline-offset-4' : ''}`}
          >
            Plan a Trip
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-blue-700" onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 bg-white border-t pt-4 pb-6 px-4 shadow-inner">
          <Link
            to="/Trips"
            onClick={toggleMenu}
            className="block text-blue-700 font-medium flex items-center gap-2"
          >
            <Map className="w-4 h-4" /> My Trips
          </Link>
          <Link
            to="/planner"
            onClick={toggleMenu}
            className="block text-blue-700 font-medium flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" /> Plan a Trip
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
