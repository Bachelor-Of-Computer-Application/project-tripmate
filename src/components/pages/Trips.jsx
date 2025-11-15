import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, PlaneTakeoff, Users, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key_here';

function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('plannedTrips');
    if (stored) {
      const parsed = JSON.parse(stored);
      Promise.all(parsed.map(async (trip) => {
        const image = await fetchImage(trip.destination);
        return { ...trip, image };
      })).then(setTrips);
    }
  }, []);

  if (trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600 text-xl">
        No trips found. <Link to="/planner" className="text-blue-500 ml-2 underline">Plan one →</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">🌍 My Trips</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, index) => (
          <Link to={`/Trips/${index}`} key={index} className="block hover:scale-[1.01] transition">
            <div className="bg-white border rounded-xl p-4 shadow-lg hover:shadow-xl transition space-y-3">
              {/* Thumbnail */}
              <div className="rounded overflow-hidden h-40 bg-gray-100 border">
                {trip.image ? (
                  <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-5 h-5 mr-2" /> No Image
                  </div>
                )}
              </div>

              {/* Title + Badge */}
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5" />
                {trip.name}
                <span className="ml-auto text-lg">{getTypeEmoji(trip.type)}</span>
              </h2>

              {/* Info */}
              <p className="text-sm flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" /> <strong>Destination:</strong> {trip.destination}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700">
                <CalendarDays className="w-4 h-4" />
                <strong>Dates:</strong> {trip.startDate} → {trip.endDate}
              </p>
              <p className="text-sm text-blue-500">
                🕒 Starts in {getDaysUntil(trip.startDate)} days
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                <strong>Friends:</strong> {trip.friends || '—'}
              </p>

              <p className="text-sm italic text-purple-600 mt-1">
                {getMotivationalQuote(trip.type)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 🖼 Fetch Unsplash image by destination
async function fetchImage(destination) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        destination
      )}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.small || '';
  } catch {
    return '';
  }
}

// 🔢 Days until trip starts
function getDaysUntil(startDate) {
  const today = new Date();
  const start = new Date(startDate);
  const diff = start - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

// 🧠 Trip motivation
function getMotivationalQuote(type) {
  switch (type) {
    case 'Road Trip': return 'Hit the road and make memories!';
    case 'Beach Vacation': return 'Sun, waves, and sandy toes!';
    case 'City Escape': return 'Explore the urban jungle!';
    case 'Hiking Adventure': return 'Climb mountains and clear your mind.';
    case 'International – Southeast Asia': return 'Culture, food, and tropical vibes.';
    case 'International – Europe': return 'History and heritage await you.';
    default: return '';
  }
}

// ✨ Emoji by trip type
function getTypeEmoji(type) {
  switch (type) {
    case 'Road Trip': return '🚗';
    case 'Beach Vacation': return '🏖️';
    case 'City Escape': return '🏙️';
    case 'Hiking Adventure': return '🥾';
    case 'International – Southeast Asia': return '🌏';
    case 'International – Europe': return '🗺️';
    default: return '🌐';
  }
}

export default Trips;
