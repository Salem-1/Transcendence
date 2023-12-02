import unittest
import requests
import json
import jwt
import os
import random
import string

class YourAppViewsTest(unittest.TestCase):
    base_url = 'http://localhost:8000'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = "TESTuser12", "TESTuser12"
        self.test_user = {'username': username, 'password': password}

    def test_register_user(self):
        # Test registration with a new username
        request_data = {'username': randomize_string(8), 'password': 'newpassA0word'}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Registration successful')

        # Test registration with an existing username
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Username already taken')

    def test_register_empty_user(self):
        # Test registration with an empty username
        request_data = {'username': '', 'password': 'newpassA0word'}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Username cannot be empty')

    def test_register_empty_pass(self):
        # Test registration with an empty password
        request_data = {'username': randomize_string(8), 'password': ''}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Passwords too short, should be 8 characters at least')

    def test_register_spoofed_user(self):
        # Test registration with a new username
        request_data = {'username': randomize_string(8), 'password': 'newpassA0word', "malicous": "0x\4\4\4\df"}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Bad request body')


    def test_fetch_username(self):
        # Assuming login endpoint returns a JWT token
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        jwt_token = login_response.json().get('jwt_token')


        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], self.test_user['username'])
    
    def test_spoofed_token(self):
        # Assuming login endpoint returns a JWT token
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        jwt_token = login_response.json().get('jwt_token') + 'a'

        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid or missing token')




def randomize_string(length):
    if length < 3:
        raise ValueError("Length must be at least 3 to ensure a combination of uppercase, lowercase, and numbers.")

    uppercase_letters = string.ascii_uppercase
    lowercase_letters = string.ascii_lowercase
    digits = string.digits

    random_string = random.choice(uppercase_letters) + random.choice(lowercase_letters) + random.choice(digits)

    remaining_length = length - 3

    for _ in range(remaining_length):
        random_char = random.choice(uppercase_letters + lowercase_letters + digits)
        random_string += random_char

    shuffled_string = ''.join(random.sample(random_string, len(random_string)))
    
    return shuffled_string

if __name__ == '__main__':
    unittest.main()




