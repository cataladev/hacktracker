"use client"; // Client component directive

import React, { useState, useRef } from 'react';

interface SidebarProps {
    setLocation: (location: string) => void;
    setDistance: (distance: number) => void;
    setIsVirtual: (isVirtual: boolean) => void;
    setIsInPerson: (isInPerson: boolean) => void;
    isVirtual: boolean;
    isInPerson: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    setLocation,
    setDistance,
    setIsVirtual,
    setIsInPerson,
    isVirtual,
    isInPerson
}) => {
    const [locationInput, setLocationInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [distanceInput, setDistanceInput] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setLocationInput(input);
        setError('');

        if (input) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json&addressdetails=1&limit=5`);
                const data = await response.json();

                const filteredSuggestions = data.map((item: any) => item.display_name).filter(Boolean);
                setSuggestions(filteredSuggestions);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSave = () => {
        setLocation(locationInput);
        setDistance(distanceInput);
        setSuggestions([]); // Clear suggestions
    };

    const toggleIsVirtual = () => {
        setIsVirtual(!isVirtual); // Directly toggle the boolean state
    };

    const toggleIsInPerson = () => {
        setIsInPerson(!isInPerson); // Directly toggle the boolean state
    };

    return (
        <div className="sidebar-container" ref={sidebarRef}>
            <div className="sidebar">
                <ul>
                    <li>
                        <input
                            type="text"
                            value={locationInput}
                            onChange={handleLocationChange}
                            placeholder="Enter location"
                            className="location-input"
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => setLocationInput(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {error && <p className="error-message">{error}</p>}
                    </li>
                    <li>
                        <input
                            type="number"
                            value={distanceInput}
                            onChange={(e) => setDistanceInput(Number(e.target.value))}
                            placeholder="Max distance (km)"
                            className="distance-input"
                        />
                    </li>
                    <li>
                        <label>
                            <input
                                type="checkbox"
                                checked={isVirtual}
                                onChange={toggleIsVirtual} // Directly call the toggle function
                            />
                            Virtual
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isInPerson}
                                onChange={toggleIsInPerson} // Directly call the toggle function
                            />
                            In-Person
                        </label>
                    </li>
                </ul>
                <div className="save-container">
                    <button onClick={handleSave} className="save-button">Save</button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
