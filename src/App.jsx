// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Planner from './components/pages/Planner';
import Trips from './components/pages/Trips';
import TripDetails from './components/pages/TripDetails';
import Navbar from './components/Navbar'; // 👈 Import the Navbar

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/planner" element={<Planner />} />
                <Route path="/Trips" element={<Trips />} />
                <Route path="/Trips/:id" element={<TripDetails />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
