"use client"; // Mark this component as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importing useRouter from next/navigation

interface Hackathon {
  name: string;
  date: string;
  location: string;
  modality: string;
  image: string;
  url: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

const fetchCoordinates = async (location: string) => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      location
    )}&key=9edd9f2be854464ca5be5a32ad50ad7a`
  );
  const data = await response.json();

  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lon: lng };
  } else {
    throw new Error("Location not found");
  }
};

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns the distance in kilometers
};

const Dashboard = () => {
  const router = useRouter(); // Use useRouter for navigation
  const [recommendedHackathons, setRecommendedHackathons] = useState<Hackathon[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");

    if (userData) {
      fetchCoordinates(userData.location)
        .then((userCoords) => {
          fetch("/mlhfixed.json")
            .then((response) => response.json())
            .then((data: Hackathon[]) => {
              const filteredHackathons = data
                .map((hackathon) => {
                  const distanceToHackathon = haversineDistance(
                    userCoords.lat,
                    userCoords.lon,
                    hackathon.latitude || 0,
                    hackathon.longitude || 0
                  );
                  return { ...hackathon, distance: distanceToHackathon };
                })
                .filter((hackathon) => hackathon.distance <= userData.distance);

              setRecommendedHackathons(filteredHackathons);
            })
            .catch((error) => {
              console.error("Error fetching hackathon data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching coordinates:", error);
        });
    } else {
      console.error("User data is not available.");
    }
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <main className="relative p-4">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 z-[-1] w-full h-full object-cover"
      >
        <source src="/spacevideo.webm" type="video/webm" />
      </video>
      <div className="p-4 animate-fadeIn">
        <h1 className="text-3xl text-white flex justify-center font-bold mb-4" style={{ paddingBottom: '15px' }}>
          Recommended Hackathons
        </h1>
        <ul className="space-y-4"> {/* Increased space between items */}
          {recommendedHackathons.slice(0, visibleCount).map((hackathon, index) => (
            <li key={index} className="flex border p-4 rounded bg-black bg-opacity-85 items-center"> {/* Align items center */}
              <img src={hackathon.image} alt={hackathon.name} className="w-1/5 h-auto mr-4" />
              <div className="text-white flex flex-col gap-2"> {/* Added gap for spacing */}
                <h2 className="font-bold">{hackathon.name}</h2>
                <p>Dates: {hackathon.date}</p>
                <p>Modality: {hackathon.modality}</p>
                <p>Location: {hackathon.location}</p>
                <a href={hackathon.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  <button className="bg-[#e63946] text-white rounded-full py-2 px-4 transition-transform transform hover:scale-110">
                    Apply Here
                  </button>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4"> {/* Align buttons horizontally */}
          {visibleCount < recommendedHackathons.length && (
            <button onClick={handleViewMore} className="bg-[#e63946] text-white px-4 py-2 rounded">
              View More
            </button>
          )}
          <button onClick={() => router.push('/profile')} className="bg-[#e63946] text-white px-4 py-2 rounded">
            Change Settings
          </button>
        </div>
        {recommendedHackathons.length === 0 && (
          <p className="text-white">No hackathons found for your criteria.</p>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
