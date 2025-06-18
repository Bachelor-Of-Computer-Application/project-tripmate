// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Users } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/planner');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-center bg-gradient-to-br from-yellow-100 via-orange-100 to-blue-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-md bg-white bg-opacity-70 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg sm:text-xl">
          <Users />
          <span>ReunionTrips</span>
        </div>
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base hover:bg-blue-600 transition"
        >
          Plan Now
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 pt-10 pb-8 sm:pt-16 sm:pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-5xl font-extrabold text-gray-800 mb-4 leading-tight"
        >
          Reunite. Relive. Rediscover.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-base sm:text-lg text-gray-600 max-w-md sm:max-w-2xl mb-6 sm:mb-8"
        >
          From childhood laughter to grown-up adventures — plan the next trip with those
          who matter most.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg"
        >
          <PartyPopper size={20} />
          Start Planning
        </motion.button>
      </main>

      {/* Animated Background Shapes */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-28 -left-20 w-56 h-56 sm:w-72 sm:h-72 bg-pink-200 rounded-full opacity-30 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-24 -right-20 w-56 h-56 sm:w-72 sm:h-72 bg-blue-300 rounded-full opacity-30 blur-3xl"
      />

      {/* Footer */}
      <footer className="text-xs sm:text-sm text-gray-500 bg-white bg-opacity-50 backdrop-blur-sm py-3 sm:py-4 px-2 sm:px-4">
        <p>
          “True friendship isn’t about being inseparable — it’s about being separated and
          nothing changes.” 💛
        </p>
      </footer>
    </div>
  );
}

export default Home;
