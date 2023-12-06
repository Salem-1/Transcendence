import requests
import json

def test_user_deletion():
    # Replace with the actual username and password for the user you want to delete
    username = 'werty23FG'
    password = 'werty23FG'

    # URL of your delete_user endpoint
    delete_user_url = 'http://localhost:8000/delete_user/'

    # Prepare the request data
    data = {'username': username, 'password': password}

    try:
        # Make a POST request to delete the user
        response = requests.post(delete_user_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})

        # Check if the request was successful (HTTP status code 200)
        if response.status_code == 200:
            print(response.json())
        else:
            print(f"Failed to delete the user. Status Code: {response.status_code}, Response: {response.text}")

    except Exception as e:
        print(f"An error occurred: {e}")

# Call the function to test user deletion
test_user_deletion()

