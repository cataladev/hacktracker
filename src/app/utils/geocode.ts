
export const fetchCoordinates = async (location: string) => {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=9edd9f2be854464ca5be5a32ad50ad7a`);
    const data = await response.json();
  
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lon: lng };
    } else {
      throw new Error('Location not found');
    }
  };
  