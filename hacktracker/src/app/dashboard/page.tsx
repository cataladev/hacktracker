// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface Hackathon {
  name: string;
  date: string;
  location: string;
  modality: string;
  image: string;
  url: string;
}

const monthMap: { [key: string]: number } = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const Dashboard = () => {
  const [recommendedHackathons, setRecommendedHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');

    if (userData) {
      fetch('/mlh.json')
        .then(response => response.json())
        .then((data: Hackathon[]) => {
          const filteredHackathons = data.filter((hackathon: Hackathon) => {
            const hackathonDates = parseDates(hackathon.date);
            const startEndDates = parseUserDates(userData.startDate, userData.endDate);

            if (!startEndDates) return false; // Skip if user dates are invalid

            const [startDate, endDate] = startEndDates;

            const distanceToHackathon = calculateDistance(userData.location, hackathon.location);

            // Check if any hackathon date falls between start and end dates
            const isDateInRange = hackathonDates.some(hackathonDate =>
              hackathonDate >= startDate && hackathonDate <= endDate
            );

            return (
              distanceToHackathon <= userData.distance &&
              isDateInRange
            );
          });

          setRecommendedHackathons(filteredHackathons);
        });
    }
  }, []);

  const parseDates = (dateStr: string) => {
    return dateStr.split(' - ').map(date => {
      const [month, dayWithSuffix] = date.split(' ');

      // Ensure dayWithSuffix is defined and valid
      if (!dayWithSuffix) {
        throw new Error(`Invalid date format: ${date}`);
      }

      // Remove suffixes and parse day as a number
      const day = parseInt(dayWithSuffix.replace(/th|st|nd|rd/, ''), 10);
      const monthIndex = monthMap[month as keyof typeof monthMap];

      // Ensure monthIndex is valid
      if (monthIndex === undefined || isNaN(day)) {
        throw new Error(`Invalid month or day in date: ${date}`);
      }

      // Return a Date object for the current year
      return new Date(new Date().getFullYear(), monthIndex, day);
    });
  };

  const parseUserDates = (startDateStr?: string, endDateStr?: string) => {
    if (!startDateStr || !endDateStr) return null;

    const startDateArray = parseDates(startDateStr);
    const endDateArray = parseDates(endDateStr);

    if (!startDateArray.length || !endDateArray.length) return null;

    const startDate = startDateArray[0];
    const endDate = endDateArray[0];

    return [startDate, endDate] as [Date, Date];
  };

  const calculateDistance = (userLocation: string, hackathonLocation: string) => {
    return 0; // Placeholder for distance calculation logic
  };

  return (
    <div className="p-4">
      <h1>Recommended Hackathons</h1>
      {recommendedHackathons.length > 0 ? (
        <ul>
          {recommendedHackathons.map((hackathon, index) => (
            <li key={index} className="mb-4 border p-4 rounded">
              <h2 className="font-bold">{hackathon.name}</h2>
              <p>Date: {hackathon.date}</p>
              <p>Location: {hackathon.location}</p>
              <p>Modality: {hackathon.modality}</p>
              <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                <img src={hackathon.image} alt={hackathon.name} className="w-full h-auto" />
              </a>
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
