import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  UserPlus,
  PlaneTakeoff,
  Mountain,
  Building,
  Sun,
  Globe,
  Car,
  ImageIcon,
} from 'lucide-react';

const UNSPLASH_ACCESS_KEY = '_raBdfzRir6mbtiEcT4cRegBipNL2XVufQSH444_FOw';

function Planner() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [trip, setTrip] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    friends: '',
    type: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingTrips = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    const updatedTrips = [...existingTrips, trip];
    localStorage.setItem('plannedTrips', JSON.stringify(updatedTrips));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/Trips');
    }, 2000);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!trip.destination.trim()) {
        setImageUrl('');
        return;
      }

      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            trip.destination
          )}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`
        );
        const data = await res.json();
        if (data.results && data.results[0]) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setImageUrl('');
        }
      } catch (error) {
        console.error('Image fetch failed:', error);
        setImageUrl('');
      }
    };

    const timeout = setTimeout(fetchImage, 500);
    return () => clearTimeout(timeout);
  }, [trip.destination]);

  const tripTypeBackgrounds = {
    'Road Trip': 'https://images.unsplash.com/photo-1502920917128-1aa500764b8a',
    'Beach Vacation': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'City Escape': 'https://images.unsplash.com/photo-1505765052765-8f68fcf870df',
    'Hiking Adventure': 'https://images.unsplash.com/photo-1508780709619-79562169bc64',
    'International – Southeast Asia': 'https://images.unsplash.com/photo-1549887534-3e188f30c6f2',
    'International – Europe': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
  };

  const selectedBg = tripTypeBackgrounds[trip.type];

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: selectedBg
          ? `url(${selectedBg})`
          : 'linear-gradient(to bottom right, #fef3c7, #dbeafe)',
      }}
    >
      {/* ✅ Toast Message */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-up">
          🎉 Trip successfully created!
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="bg-white/80 border border-white/30 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-4xl grid md:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
              <PlaneTakeoff /> Plan Your Trip
            </h2>

            <Input label="Trip Name" name="name" value={trip.name} onChange={handleChange} />
            <Select label="Trip Type" name="type" value={trip.type} onChange={handleChange} />
            <Input label="Destination" name="destination" icon={<MapPin />} value={trip.destination} onChange={handleChange} />
            <DateRange trip={trip} onChange={handleChange} />
            <Input label="Invite Friends (Optional)" name="friends" icon={<UserPlus />} value={trip.friends} onChange={handleChange} />

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition">
              Create Trip ✨
            </button>
          </form>

          <div className="bg-white/90 rounded-lg p-4 shadow-md flex flex-col justify-between border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Trip Preview</h3>

            <div className="space-y-2 text-sm text-gray-700">
              <PreviewText label="Type" value={trip.type} emoji={trip.type?.includes('Europe') ? '🗺️' : ''} />
              <PreviewText label="Destination" value={trip.destination} icon="📍" />
              <PreviewText label="Dates" value={`${trip.startDate || '—'} → ${trip.endDate || '—'}`} icon="📅" />
              <PreviewText label="With" value={trip.friends} icon="👯" />
              <p className="text-sm italic text-blue-600 mt-2">{getMotivationalQuote(trip.type)}</p>
            </div>

            <div className="mt-4 rounded overflow-hidden border border-gray-300">
              {imageUrl ? (
                <img src={imageUrl} alt="Destination Preview" className="w-full h-40 object-cover rounded" />
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 bg-gray-100">
                  <ImageIcon className="w-4 h-4" />
                  <span className="ml-2">No image preview</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔧 Reusable Components

const Input = ({ label, name, value, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={label !== 'Invite Friends (Optional)'}
        className={`w-full ${icon ? 'pl-10' : 'pl-3'} border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400`}
        placeholder={`e.g. ${label}`}
      />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full mt-1 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400"
    >
      <option value="" disabled>Select a trip type</option>
      <option value="Road Trip">🚗 Road Trip</option>
      <option value="Beach Vacation">🏖️ Beach Vacation</option>
      <option value="City Escape">🏙️ City Escape</option>
      <option value="Hiking Adventure">🥾 Hiking Adventure</option>
      <option value="International – Southeast Asia">🌏 Southeast Asia</option>
      <option value="International – Europe">🗺️ Europe</option>
    </select>
  </div>
);

const DateRange = ({ trip, onChange }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={trip.startDate}
        onChange={onChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">End Date</label>
      <input
        type="date"
        name="endDate"
        value={trip.endDate}
        onChange={onChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>
);

const PreviewText = ({ label, value, icon, emoji }) => (
  <p>
    <strong>{icon || emoji} {label}:</strong> {value || '—'}
  </p>
);

// 🎉 Motivation
function getMotivationalQuote(type) {
  switch (type) {
    case 'Road Trip': return 'Adventure is out there. Fuel up & drive!';
    case 'Beach Vacation': return 'Sun, sand, and stories to tell!';
    case 'City Escape': return 'Every street has a story. Go discover it.';
    case 'Hiking Adventure': return 'Take a hike and find yourself.';
    case 'International – Southeast Asia': return 'Dive into culture and cuisine!';
    case 'International – Europe': return 'History, art, and unforgettable cities await.';
    default: return '';
  }
}

export default Planner;
