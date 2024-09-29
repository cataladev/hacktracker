// app/input/page.tsx
"use client";

import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect, useRef } from 'react';
import { fetchLocationSuggestions, LocationSuggestion } from '../utils/location';

const InputPage = () => {
  const router = useRouter(); // Initialize useRouter
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({ city: '', state: '', country: '' });
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
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
      location: selectedLocation,
      startDate: `${startMonth}-${startDay}`,
      endDate: `${endMonth}-${endDay}`,
      distance,
      modality,
    };

    // Save user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setSelectedLocation({
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || '',
      state: suggestion.address.state || '',
      country: suggestion.address.country,
    });
    setLocation(suggestion.display_name); // Set the location input to the selected suggestion
    setSuggestions([]); // Clear suggestions
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

  // Month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 mb-4 w-full"
          placeholder="Enter your location"
        />
        {suggestions.length > 0 && (
          <ul ref={suggestionsRef} className="border bg-white p-2 rounded">
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
        
        {/* Start Date Dropdowns */}
        <div className="flex mb-4 items-center">
          <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="border p-2 mr-2">
            <option value="">Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <select value={startDay} onChange={(e) => setStartDay(e.target.value)} className="border p-2 mr-4">
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <span>Start Date</span>
        </div>

        {/* End Date Dropdowns */}
        <div className="flex mb-4 items-center">
          <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="border p-2 mr-2">
            <option value="">Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <select value={endDay} onChange={(e) => setEndDay(e.target.value)} className="border p-2 mr-4">
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <span>End Date</span>
        </div>

        <input
          type="range"
          min={0}
          max={5000}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="mb-4"
        />
        <label>Distance: {distance} km</label>
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
        <button type="submit" className="bg-blue-500 text-white p-2">
          Save
        </button>
      </form>
    </div>
  );
};

export default InputPage;
