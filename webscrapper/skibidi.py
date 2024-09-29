import json
from geopy.geocoders import Nominatim


input_file = 'mlh.json'  
output_file = 'mlhfixed.json'  

def get_coordinates(location):
    geolocator = Nominatim(user_agent="location_finder")
    location = geolocator.geocode(location)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None


with open(input_file, 'r') as file:
    data = json.load(file)

for event in data:
    location = event["location"]
    latitude, longitude = get_coordinates(location)
    event["latitude"] = latitude
    event["longitude"] = longitude

with open(output_file, 'w') as file:
    json.dump(data, file, indent=4)

print(f"Updated JSON with coordinates saved to '{output_file}'")
