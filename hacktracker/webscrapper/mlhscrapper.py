import requests
from bs4 import BeautifulSoup

# URL of the MLH events page
url = "https://mlh.io/seasons/2025/events"

# Send a GET request to the page
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the section containing hackathon information
    events = soup.find_all('div', class_='event-wrapper')  # Adjust the class as necessary

    # List to hold hackathon data
    hackathons = []

    for event in events:
        image = event.find('src').text.strip()  
        name = event.find('h3', class_ = 'event-name').text.strip()  # Adjust based on actual HTML structure
        date = event.find('p', class_='event-date').text.strip()  # Adjust based on actual HTML structure
        location = event.find('div', class_='event-location').text.strip()  # Adjust based on actual HTML structure
        link = event.find('a')['href']  # Event link

        # Append the hackathon data to the list
        hackathons.append({
            'image' : image,
            'name': name,
            'date': date,
            'location': location,
            'link': link,
        })

    # Print the list of hackathons
    for hack in hackathons:
        print(f"Name: {hack['name']}, Date: {hack['date']}, Location: {hack['location']}, Link: {hack['link']}")
else:
    print(f"Failed to retrieve data: {response.status_code}")
