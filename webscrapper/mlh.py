from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import json

# Set up the web driver (update the path to where you placed ChromeDriver)
service = Service(r'C:\Users\ferna\Downloads\chromedriver-win64\chromedriver-win64\chromedriver.exe') #change based on path
driver = webdriver.Chrome(service=service)

# Open the webpage
driver.get('https://mlh.io/seasons/2025/events')

# Find all event cards
events = driver.find_elements(By.CLASS_NAME, 'event')  # Update 'event' to the actual class name

event_data = []
for event in events:
    try:
        name = event.find_element(By.CLASS_NAME, 'event-name').text
    except:
        name = None
    try:
        date = event.find_element(By.CLASS_NAME, 'event-date').text
    except:
        date = None
    try:
        location = event.find_element(By.CLASS_NAME, 'event-location').text
    except:
        location = None
    try:
        modality = event.find_element(By.CLASS_NAME, 'event-hybrid-notes').text
    except:
        modality = None
    try:
        image = event.find_element(By.TAG_NAME, 'img').get_attribute('src')
    except:
        image = None
    try:
        url = event.find_element(By.TAG_NAME, 'a').get_attribute('href')
    except:
        url = None
    
    event_data.append({
        'name': name,
        'date': date,
        'location': location,
        'modality': modality,
        'image': image,
        'url': url
    })

# Print the collected data for debugging
print(json.dumps(event_data, indent=4))

# Save the data to a JSON file
output_file = r'C:\Users\ferna\Downloads'

# Save the data to a JSON file with error handling
try:
    with open(output_file, 'w') as f:
        json.dump(event_data, f, indent=4)
    print(f"Data successfully written to {output_file}")
except Exception as e:
    print(f"Error writing to file: {e}")

# Close the web driver
driver.quit()