import unittest
from unittest.mock import patch
import json
import jwt
import os, sys 

sys.path.append('../backend/db/') 
from views import register_user

# , login_user, fetch_username, spoofed_token

class YourAppViewsTest(unittest.TestCase):
    def setUp(self):
        # Create a test user
        self.test_user = {'username': 'testuser', 'password': 'testpassword'}

    def test_register_user(self):
        # Test registration with a new username
        request_data = {'username': 'newuser', 'password': 'newpassA0word'}
        response = register_user(request_data)
        self.assertEqual(response['status_code'], 200)
        self.assertEqual(response['message'], 'Registration successful')

        # Test registration with an existing username
        response = register_user(self.test_user)
        self.assertEqual(response['status_code'], 400)
        self.assertEqual(response['error'], 'Username already taken')

    # def test_empty_user(self):
    #     # Test registration with an empty username
    #     request_data = {'username': '', 'password': 'newpassA0word'}
    #     response = register_user(request_data)
    #     self.assertEqual(response['status_code'], 400)
    #     self.assertEqual(response['error'], 'Username cannot be empty')

    # def test_register_empty_pass(self):
    #     # Test registration with an empty password
    #     request_data = {'username': 'newuser', 'password': ''}
    #     response = register_user(request_data)
    #     self.assertEqual(response['status_code'], 400)
    #     self.assertEqual(response['error'], 'Passwords too short, should be 8 characters at least')

    # # ... (other tests)

    # def test_fetch_username(self):
    #     with patch('your_app.views.authenticate_user', return_value=self.test_user):
    #         with patch('your_app.views.get_jwt_token', return_value='mocked_token'):
    #             response = fetch_username(self.test_user['username'])
    #             self.assertEqual(response['status_code'], 200)
    #             self.assertEqual(response['username'], self.test_user['username'])

    # def test_spoofed_token(self):
    #     request_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
    #     with patch('your_app.views.authenticate_user', return_value=self.test_user):
    #         response = login_user(request_data)
    #         jwt_token = response['jwt_token'] + 'a'
    #         with patch('your_app.views.get_jwt_token', return_value=jwt_token):
    #             spoof_response = spoofed_token(jwt_token)
    #             self.assertEqual(spoof_response['status_code'], 401)
    #             self.assertEqual(spoof_response['error'], 'Invalid or missing token')

if __name__ == '__main__':
    unittest.main()
