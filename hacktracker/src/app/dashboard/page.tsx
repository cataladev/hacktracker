"use client";

import { useEffect, useState } from 'react';

interface Hackathon {
  name: string;
  location: string;
  modality: string;
  image: string;
  url: string;
  lat?: number;  // Added latitude
  lon?: number;  // Added longitude
  distance?: number;  // Added distance
}

const fetchCoordinates = async (location: string) => {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=9edd9f2be854464ca5be5a32ad50ad7a`);
  const data = await response.json();

  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  } else {
    throw new Error('Location not found');
  }
};

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const Dashboard = () => {
  const [recommendedHackathons, setRecommendedHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');

    if (userData) {
      fetchCoordinates(userData.location).then(userCoords => {
        fetch('/mlhfixed.json')
          .then(response => response.json())
          .then((data: Hackathon[]) => {
            const filteredHackathons = data
              .map(hackathon => {
                const distanceToHackathon = haversineDistance(userCoords.lat, userCoords.lon, hackathon.lat || 0, hackathon.lon || 0);
                return { ...hackathon, distance: distanceToHackathon };
              })
              .filter(hackathon => {
                const isModalityMatch = userData.modality === 'both' || userData.modality.toLowerCase() === hackathon.modality.toLowerCase();
                return hackathon.distance <= userData.distance && isModalityMatch;
              });

            // Sort hackathons by distance
            const sortedHackathons = filteredHackathons.sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setRecommendedHackathons(sortedHackathons);
          });
      }).catch(error => {
        console.error(error);
      });
    }
  }, []);

  return (
    <div className="p-4">
      <h1>Recommended Hackathons</h1>
      {recommendedHackathons.length > 0 ? (
        <ul>
          {recommendedHackathons.map((hackathon, index) => (
            <li key={index} className="mb-4 border p-4 rounded">
              <img src={hackathon.image} alt={hackathon.name} className="w-full h-auto" />
              <h2 className="font-bold">{hackathon.name}</h2>
              <p>Location: {hackathon.location}</p>
              <p>Modality: {hackathon.modality}</p>
              <p>Distance: {hackathon.distance?.toFixed(2)} km</p>
              <a href={hackathon.url} target="_blank" rel="noopener noreferrer">Apply Here</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hackathons found for your criteria.</p>
      )}
    </div>
  );
};

export default Dashboard;