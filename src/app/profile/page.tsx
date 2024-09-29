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
  const [isEditingDistance, setIsEditingDistance] = useState(false);
  
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (location && (selectedLocation.city === '' && selectedLocation.state === '' && selectedLocation.country === '')) {
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
  }, [location, selectedLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      location: `${selectedLocation.city ? selectedLocation.city + ', ' : ''}${selectedLocation.state}${selectedLocation.country ? ', ' + selectedLocation.country : ''}`,
      distance,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || '';
    const state = suggestion.address.state || '';
    const country = suggestion.address.country || '';

    setSelectedLocation((prev) => {
      if (
        prev.city !== city ||
        prev.state !== state ||
        prev.country !== country
      ) {
        setLocation(`${city ? city + ', ' : ''}${state}${country ? ', ' + country : ''}`);
        setSuggestions([]);
        return { city, state, country };
      }
      return prev;
    });
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

  const handleDistanceChange = (value: number) => {
    if (value >= 0 && value <= 5000) {
      setDistance(value);
    }
  };

  const handleDistanceEditToggle = () => {
    setIsEditingDistance(!isEditingDistance);
  };

  const handleDistanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 5000) {
      setDistance(value);
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <form 
          onSubmit={handleSubmit} 
          className="p-8 rounded border border-white transition duration-300 hover:border-red-600 shadow-md w-full max-w-md animate-fadeIn" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
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
              {suggestions.map((suggestion) => {
                const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || '';
                const state = suggestion.address.state || '';
                const country = suggestion.address.country || '';

                let displayName = '';
                if (city) {
                  displayName += city;
                }
                if (state) {
                  displayName += (displayName ? `, ${state}` : state);
                }
                if (country) {
                  displayName += (displayName ? `, ${country}` : country);
                }

                return (
                  <li
                    key={`${city}-${state}-${country}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer hover:bg-gray-200 p-1"
                  >
                    {displayName}
                  </li>
                );
              })}
            </ul>
          )}
          
          <input
            type="range"
            min={0}
            max={5000}
            value={distance}
            onChange={(e) => handleDistanceChange(Number(e.target.value))}
            className="mb-4 w-full"
          />
          <label className="block mb-2 text-white">
            Distance willing to travel: 
            {isEditingDistance ? (
              <input
                type="number"
                value={distance}
                onChange={handleDistanceInputChange}
                onBlur={handleDistanceEditToggle} 
                className="text-white bg-transparent border-b border-white w-20 ml-2"
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <span 
                onClick={handleDistanceEditToggle} 
                className="cursor-pointer ml-2"
              >
                {distance} km
              </span>
            )}
          </label>
          
          <button type="submit" className="rounded-full font-bold bg-[#e63946] text-white py-3 px-10 w-full shadow hover:border-white-600 hover:bg-[#d62839]">
            Save   
          </button>
        </form>
      </div>
    </main>
  );
};

export default InputPage;
