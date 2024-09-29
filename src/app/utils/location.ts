
export interface LocationSuggestion {
    place_id: string;
    display_name: string;
    address: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country: string;
    };
  }
  
  export const fetchLocationSuggestions = async (query: string) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=10`);
  
    if (!response.ok) {
      throw new Error('Error fetching location suggestions');
    }
  
    const data: LocationSuggestion[] = await response.json();
    return data; 
  };
  