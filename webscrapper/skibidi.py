import json
from geopy.geocoders import Nominatim

# Specify the input JSON file
input_file = 'mlh.json'  # Replace with your file name or path
output_file = 'mlhfixed.json'  # Output file

# Function to get coordinates
def get_coordinates(location):
    geolocator = Nominatim(user_agent="location_finder")
    location = geolocator.geocode(location)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None

# Load existing JSON data
with open(input_file, 'r') as file:
    data = json.load(file)

# Add latitude and longitude to each event
for event in data:
    location = event["location"]
    latitude, longitude = get_coordinates(location)
    event["latitude"] = latitude
    event["longitude"] = longitude

# Save the updated JSON data to a new file
with open(output_file, 'w') as file:
    json.dump(data, file, indent=4)

print(f"Updated JSON with coordinates saved to '{output_file}'")
