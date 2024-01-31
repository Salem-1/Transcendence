import unittest
import requests
import json
import jwt
import os
import random
import string
import datetime
import warnings
from test_endpoints import randomize_string
# Suppress all warnings
warnings.filterwarnings("ignore")

username_g , password_g = randomize_string(8), randomize_string(8)

class YourAppViewsTest(unittest.TestCase):
    base_url = 'http://localhost:8000'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = username_g , password_g 
        self.test_user = {'username': username, 'password': password}
        request_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 200)


        
    def test_logout(self):
        login_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], self.test_user['username'])
        #logout
        response = requests.get(f'{self.base_url}/logout/', headers=headers)
        self.assertEqual(response.status_code, 200)

        #fetch username failuer

if __name__ == '__main__':
    unittest.main()
