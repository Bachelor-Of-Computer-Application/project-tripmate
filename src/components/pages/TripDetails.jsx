import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [image, setImage] = useState('');
  const [attractions, setAttractions] = useState([]);
  const summaryRef = useRef();

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem('plannedTrips')) || [];
    const selectedTrip = trips[id];
    if (selectedTrip) {
      setTrip(selectedTrip);
      fetchImage(selectedTrip.destination);
      fetchAttractions(selectedTrip.destination);
    }
  }, [id]);

  const fetchImage = async (destination) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&client_id=_raBdfzRir6mbtiEcT4cRegBipNL2XVufQSH444_FOw&orientation=landscape&per_page=1`
      );
      const data = await res.json();
      setImage(data.results?.[0]?.urls?.regular || '');
    } catch {
      setImage('');
    }
  };

  const fetchAttractions = async (destination) => {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=top places in ${encodeURIComponent(destination)}&format=json&origin=*`
      );
      const data = await res.json();
      const titles = data.query.search.map((item) => item.title).slice(0, 5);
      setAttractions(titles);
    } catch {
      setAttractions([]);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(trip.name, 10, 20);
    doc.setFontSize(12);
    doc.text(`Destination: ${trip.destination}`, 10, 30);
    doc.text(`Trip Type: ${trip.type}`, 10, 40);
    doc.text(`Dates: ${trip.startDate} → ${trip.endDate}`, 10, 50);
    doc.text(`Friends: ${trip.friends || '—'}`, 10, 60);
    doc.text(`Top Attractions:`, 10, 70);
    attractions.forEach((a, i) => doc.text(`- ${a}`, 12, 80 + i * 10));
    doc.save(`${trip.name}-trip-summary.pdf`);
  };

  if (!trip) return <p className="p-6 text-center text-gray-500">Loading trip details...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto" ref={summaryRef}>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{trip.name}</h1>
        <p className="text-gray-600 mb-4"><strong>Destination:</strong> {trip.destination}</p>

        {image && (
          <img
            src={image}
            alt={trip.destination}
            className="rounded-xl w-full mb-6 shadow-lg"
          />
        )}

        <div className="bg-white/80 border border-gray-200 rounded-lg p-6 space-y-3">
          <p><strong>Trip Type:</strong> {trip.type}</p>
          <p><strong>Dates:</strong> {trip.startDate} → {trip.endDate}</p>
          <p><strong>Friends:</strong> {trip.friends || '—'}</p>
        </div>

        {/* 🗺️ Google Maps Embed */}
        <div className="mt-8 rounded-xl overflow-hidden border shadow-md">
          <iframe
            title="map"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAnTNYX64rcaFnhJhUX9emVoKaaEJDjyl8&q=${encodeURIComponent(trip.destination)}`}
            width="100%"
            height="300"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>

        {/* 📌 Attractions List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Top Places to Visit</h2>
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
            <p className="text-sm text-gray-500">No attractions found for this destination.</p>
          )}
        </div>

        {/* 🧾 Download Summary */}
        <div className="mt-10 text-center">
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            📄 Download Trip Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
