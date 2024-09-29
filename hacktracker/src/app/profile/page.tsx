"use client";

import { useRouter } from 'next/navigation'; 
import { useState, useEffect, useRef } from 'react';
import { fetchLocationSuggestions, LocationSuggestion } from '../utils/location';

const InputPage = () => {
  const router = useRouter(); 
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({ city: '', state: '', country: '' });
  const [distance, setDistance] = useState(0);
  const [modality, setModality] = useState('');

  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (location) {
      const fetchData = async () => {
        try {
          const results = await fetchLocationSuggestions(location);
          setSuggestions(results);
        } catch (error) {
          console.error(error);
          setSuggestions([]);
        }
      };
      fetchData();
    } else {
      setSuggestions([]);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      location: `${selectedLocation.city}, ${selectedLocation.state}, ${selectedLocation.country}`,
      distance,
      modality,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setSelectedLocation({
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || '',
      state: suggestion.address.state || '',
      country: suggestion.address.country,
    });
    setLocation(suggestion.display_name);
    setSuggestions([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div className="flex items-center justify-center min-h-screen">
        <form 
          onSubmit={handleSubmit} 
          className="p-8 rounded border border-white transition duration-300 hover:border-red-600 shadow-md w-full max-w-md animate-fadeIn" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 mb-4 w-full"
            placeholder="Enter your location"
          />
          {suggestions.length > 0 && (
            <ul ref={suggestionsRef} className="border bg-white p-2 rounded mb-4">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer hover:bg-gray-200 p-1"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
          
          <input
            type="range"
            min={0}
            max={5000}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="mb-4 w-full custom-range"
          />
          <label className="block mb-4 text-white">Distance willing to travel: {distance} km</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className="border p-2 mb-4 w-full"
          >
            <option value="">Please select modality</option>
            <option value="both">Both</option>
            <option value="virtual">Virtual Only</option>
            <option value="in-person">In Person Only</option>
          </select>
          <button type="submit" className="rounded-full font-bold bg-[#e63946] text-white py-3 px-10 w-full shadow hover:border-white-600 hover:bg-[#d62839]">
            Save   
          </button>
        </form>
      </div>
    </main>
  );
};

export default InputPage;
