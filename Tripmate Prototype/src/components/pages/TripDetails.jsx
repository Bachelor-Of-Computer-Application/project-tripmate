import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attractions, setAttractions] = useState([]);
  const [weather, setWeather] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const intervalRef = useRef(null);
  const carouselRef = useRef();

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    const selectedTrip = trips[id];
    if (selectedTrip) { 
      setTrip(selectedTrip);
      fetchImages(selectedTrip.destination);
      fetchAttractions(selectedTrip.destination);
      fetchWeather(selectedTrip.destination);
      generateItinerary(selectedTrip.startDate, selectedTrip.endDate);
    }
  }, [id]);

  const fetchImages = async (destination) => {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&client_id=_raBdfzRir6mbtiEcT4cRegBipNL2XVufQSH444_FOw&orientation=landscape&per_page=5`
    );
    const data = await res.json();
    setImages(data.results.map((img) => img.urls.regular));
  };

  const fetchAttractions = async (destination) => {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=top places in ${encodeURIComponent(destination)}&format=json&origin=*`
    );
    const data = await res.json();
    const titles = data.query.search.map((item) => item.title).slice(0, 5);
    setAttractions(titles);
  };

  const fetchWeather = async (destination) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(destination)}&units=metric&appid=d66e3821cdf4755cf8218aa61b7b64ab`
      );
      const data = await res.json();
      const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
      setWeather(dailyData);
    } catch {
      setWeather([]);
    }
  };

  const generateItinerary = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let current = new Date(startDate);
    let day = 1;
    const result = [];

    while (current <= endDate) {
      result.push({
        day: `Day ${day}`,
        date: current.toDateString(),
        activity: "Explore the city, visit a famous attraction, and enjoy local cuisine."
      });
      current.setDate(current.getDate() + 1);
      day++;
    }
    setItinerary(result);
  };

  useEffect(() => {
    if (images.length === 0) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [images]);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTouchStart = useRef(null);
  const handleTouchEnd = useRef(null);

  const onTouchStart = (e) => {
    handleTouchStart.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    handleTouchEnd.current = e.changedTouches[0].clientX;
    if (handleTouchStart.current - handleTouchEnd.current > 50) {
      nextImage();
    } else if (handleTouchEnd.current - handleTouchStart.current > 50) {
      prevImage();
    }
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!trip) return <p className="p-6 text-center text-gray-500">Loading trip details...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{trip.name}</h1>
        <p className="text-gray-600 mb-4"><strong>Destination:</strong> {trip.destination}</p>

        {/* 🖼️ Auto Carousel with Manual Controls */}
        {images.length > 0 && (
          <div
            className="relative w-full max-w-4xl h-[250px] mx-auto mb-6 overflow-hidden rounded-xl shadow-lg"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={images[currentIndex]}
              alt={`View ${currentIndex}`}
              className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
            />
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black px-3 py-1 rounded-full shadow"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black px-3 py-1 rounded-full shadow"
            >
              ▶
            </button>
          </div>
        )}

        {/* 🧾 Trip Info */}
        <div className="bg-white/80 border border-gray-200 rounded-lg p-6 mb-6 space-y-3">
          <p><strong>Trip Type:</strong> {trip.type}</p>
          <p><strong>Dates:</strong> {trip.startDate} → {trip.endDate}</p>
          <p><strong>Friends:</strong> {trip.friends || '—'}</p>
        </div>

        {/* 🗓️ Itinerary */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">📍 Travel Itinerary</h2>
          {itinerary.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow mb-3 border-l-4 border-blue-400">
              <p className="font-bold">{item.day} - {item.date}</p>
              <p className="text-gray-600">{item.activity}</p>
            </div>
          ))}
        </div>

        {/* 🌦️ Weather */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">🌤️ Weather Forecast</h2>
          {weather.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weather.map((w, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow text-center">
                  <p className="font-semibold">{new Date(w.dt_txt).toDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                    alt="weather"
                    className="w-16 mx-auto"
                  />
                  <p>{w.main.temp}°C, {w.weather[0].main}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Weather data not available.</p>
          )}
        </div>

        {/* 📌 Attractions */}
        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">🏛️ Top Places to Visit</h2>
          {attractions.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-800 space-y-2">
              {attractions.map((title, index) => (
                <li key={index}>
                  <a
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No attractions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
