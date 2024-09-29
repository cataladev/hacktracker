"use client"; 

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { haversineDistance } from '../components/utils';

const PictureUrls = [
    {
        title: "HACK TRACKER",
        description: "Hack Tracker",
        description2: "Here are our recommendations based on your information:"
    },
];

const getCoordinatesForCity = async (location: string): Promise<[number, number] | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return [parseFloat(lat), parseFloat(lon)];
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
    }
    return null;
};

const DashboardPage: React.FC = () => {
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [filteredHackathons, setFilteredHackathons] = useState<any[]>([]);
    const [location, setLocation] = useState('');
    const [distance, setDistance] = useState(0);
    const [isVirtual, setIsVirtual] = useState(false);
    const [isInPerson, setIsInPerson] = useState(false);

    useEffect(() => {
        const fetchHackathons = async () => {
            const response = await fetch('/mlh.json');
            const data = await response.json();
            setHackathons(data);
        };
        
        fetchHackathons();
    }, []);

    useEffect(() => {
        const filterHackathons = async () => {
            if (location && distance > 0) {
                const userCoordinates = await getCoordinatesForCity(location);
                if (userCoordinates) {
                    const filtered = await Promise.all(
                        hackathons.map(async (hackathon) => {
                            const [city, state] = hackathon.location.split(', ').slice(0, 2);
                            const coordinates = await getCoordinatesForCity(`${city}, ${state}`);

                            if (coordinates) {
                                const dist = haversineDistance(userCoordinates, coordinates);
                                const modalityMatches = (isVirtual && hackathon.modality.includes("Virtual")) || 
                                                        (isInPerson && hackathon.modality.includes("In-Person"));
                                return dist <= distance && modalityMatches ? hackathon : null;
                            }
                            return null;
                        })
                    );

                    setFilteredHackathons(filtered.filter(h => h !== null)); // Remove nulls
                }
            } else {
                setFilteredHackathons(hackathons);
            }
        };

        filterHackathons();
    }, [location, distance, isVirtual, isInPerson, hackathons]);

    return (
        <main className="p-4 flex">
            <Sidebar 
                setLocation={setLocation} 
                setDistance={setDistance} 
                setIsVirtual={setIsVirtual} 
                setIsInPerson={setIsInPerson} 
                isVirtual={isVirtual}
                isInPerson={isInPerson}
            />
            <div className="flex-grow">
                <div className="flex flex-wrap justify-center w-full">
                    {PictureUrls.map((image, index) => (
                        <div key={index} className="m-4 text-center max-w-2xl">
                            <p style={{ fontWeight: 'bold', fontFamily: 'Tahoma', fontSize: '20px', color: "#a8dadc" }}>
                                {image.description}
                            </p>
                            <p style={{ fontFamily: 'Tahoma', fontSize: '20px', color: "#a8dadc" }}>
                                {image.description2}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center w-full">
                    {filteredHackathons.map((hackathon, index) => (
                        <div key={index} className="hackathon-card m-4">
                            <img src={hackathon.image} alt={hackathon.name} />
                            <h3>{hackathon.name}</h3>
                            <p>{hackathon.date}</p>
                            <p>{hackathon.location}</p>
                            <a href={hackathon.url} target="_blank" rel="noopener noreferrer">Apply</a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
