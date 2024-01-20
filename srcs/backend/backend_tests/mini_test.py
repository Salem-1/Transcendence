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

class YourAppViewsTest(unittest.TestCase):
    base_url = 'http://localhost:8000'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = "sdfasHH3453", "sdfasHH3453"
        self.test_user = {'username': username, 'password': password}



    def test_register_initial_user(self):
        # Test registration with a new username
        request_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        
        request_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        
        self.assertEqual(response.status_code, 400)
        # request_data = {'username': self.otp_user["username"], 'password': self.otp_user["password"]}
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        

    def test_access_home_loggedin(self):
        login_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/api/loginVerfication/', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'valid token')
        response = requests.get(f'{self.base_url}/api/notLoggedIn/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'valid token')

if __name__ == '__main__':
    unittest.main()
