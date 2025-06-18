// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Planner from './components/pages/Planner';
import Trips from './components/pages/Trips';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/planner' element={<Planner/>} />
      <Route path='/Trips' element={<Trips/>} />
    </Routes>
  );
}

export default App;
