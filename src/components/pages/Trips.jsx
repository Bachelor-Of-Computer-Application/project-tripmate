import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, PlaneTakeoff, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('plannedTrips');
    if (stored) {
      setTrips(JSON.parse(stored));
    }
  }, []);

  if (trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600 text-xl">
        No trips found. <Link to="/planner" className="text-blue-500 ml-2 underline">Create one →</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">🌍 My Trips</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, index) => (
          <div key={index} className="bg-white border rounded-xl p-5 shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-700">
              <PlaneTakeoff /> {trip.name}
            </h2>

            <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
              <MapPin /> <strong>Destination:</strong> {trip.destination}
            </p>

            <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
              <CalendarDays /> <strong>Dates:</strong> {trip.startDate} → {trip.endDate}
            </p>

            <p className="text-sm flex items-center gap-2 text-gray-700 mb-1">
              <Users /> <strong>Friends:</strong> {trip.friends || '—'}
            </p>

            <p className="text-sm text-purple-600 mt-2 italic">
              {getMotivationalQuote(trip.type)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Optional motivational line reused here too
function getMotivationalQuote(type) {
  switch (type) {
    case 'Road Trip':
      return 'Hit the road and make memories!';
    case 'Beach Vacation':
      return 'Sun, waves, and sandy toes!';
    case 'City Escape':
      return 'Explore the urban jungle!';
    case 'Hiking Adventure':
      return 'Climb mountains and clear your mind.';
    case 'International – Southeast Asia':
      return 'Culture, food, and tropical vibes.';
    case 'International – Europe':
      return 'History and heritage await you.';
    default:
      return '';
  }
}

export default Trips;
