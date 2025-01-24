import requests
from flask import current_app

def geocode_address(address):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": f"{address}, Nassau, Bahamas",
        "key": current_app.config['GOOGLE_MAPS_API_KEY']
    }
    
    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        
        if data["status"] == "OK":
            location = data["results"][0]["geometry"]["location"]
            return location["lat"], location["lng"]
        return None, None
    except Exception as e:
        current_app.logger.error(f"Geocoding error: {str(e)}")
        return None, None
