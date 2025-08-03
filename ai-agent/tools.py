import requests

BASE_URL = "http://35.222.164.202:5287/api"

def create_sensor(sensor_name: str) -> str:
    response = requests.post(f"{BASE_URL}/sensors", json={"name": sensor_name})
    return "Sensor created successfully." if response.ok else f"Error: {response.text}"

def get_sensors() -> list:
    response = requests.get(BASE_URL)
    return response.json() if response.ok else []

def get_sensor_data(sensor_name: str, from_date: str, to_date: str) -> list:
    response = requests.get(f"{BASE_URL}/sensorvalues", params={
        "name": sensor_name,
        "startDate": from_date,
        "endDate": to_date
    })
    return response.json() if response.ok else []
