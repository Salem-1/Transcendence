import unittest
import requests
import json
import jwt
import os
import random
import string
import datetime

class YourAppViewsTest(unittest.TestCase):
    base_url = 'http://localhost:8000'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = "TESTuser12", "TESTuser12"
        self.test_user = {'username': username, 'password': password}
        username , password = "TESTuser122", "TESTuser122"
        self.otp_user = {'username': username , 'password': password}

    def test_expired_jwt(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        
        jwt_token = login_response.json().get('jwt_token')
        jwt_token = jwt.decode(jwt_token, os.environ['secret_pass'], algorithms=['HS256'])
        exp_jwt_token = gen_jwt_token(self.test_user['username'], jwt_token['type'], 0, jwt_token['id'])
        headers = {'Cookie': f'Authorization=Bearer {exp_jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], "Invalid Authorization token")

    def test_otp_token_privilage(self):
        login_data = {'username': self.otp_user['username'], 'password': self.otp_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        jwt_token = login_response.json().get('jwt_token')

        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid Authorization token')
    
    def test_fetch_username(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], self.test_user['username'])
    
 
    
    def test_fetch_username(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], self.test_user['username'])

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

    def test_register_wrong_request_method(self):
        # Test registration with a new username
        request_data = {'username': randomize_string(8), 'password': 'newpassA0word'}
        response = requests.get(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')
        response = requests.delete(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')
        response = requests.put(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')


    def test_register_spoofed_user(self):
        # Test registration with a new username
        request_data = {}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Bad request body')



    
    def test_spoofed_token(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        jwt_token = login_response.json().get('jwt_token') + 'spoof'

        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid Authorization token')
    
    def test_otp_token(self):
        login_data = {'username': self.otp_user['username'], 'password': self.otp_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        jwt_token = login_response.json().get('jwt_token')
        self.assertEqual(login_response.status_code, 302)
        self.assertEqual(login_response.json()['type'], 'otp')

    def test_normal_login(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()['username'], self.test_user['username'])

    def test_otp_half_login(self):
        login_data = {'username': self.otp_user['username'], 'password': self.otp_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 302)
        # self.assertEqual(login_response.json()['username'], self.test_user['username'])
    
    def test_empty_login(self):
        login_data = {'username': "", 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], 'Username cannot be empty')

        login_data = {'username': self.test_user['username'], 'password': ""}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], 'Passwords too short, should be 8 characters at least')

    def test_empty_login(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password'], "smuggle" : "some malicous string"}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], 'Bad request body')
   
    def test_empty_body_login(self):
        login_data = {}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], 'Bad request body')

    def test_login_wrong_request_method(self):
        # Test registration with a new username
        request_data = {'username': randomize_string(8), 'password': 'newpassA0word'}
        response = requests.get(f'{self.base_url}/login/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')
        response = requests.delete(f'{self.base_url}/login/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')
        response = requests.put(f'{self.base_url}/login/', json=request_data)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Method not allowed')

    def test_bad_intra(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/auth/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], "couldn't fetch intra user data")
        login_data = {'username': "", 'password': ""}
        login_response = requests.post(f'{self.base_url}/auth/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], "couldn't fetch intra user data")
        login_data = {"code": "ERTCYVUybunmisoubcvyastts234567890NJBKHVGCFXDGSrtdhyfjvghb"}
        login_response = requests.post(f'{self.base_url}/auth/', json=login_data)
        self.assertEqual(login_response.status_code, 400)
        self.assertEqual(login_response.json()['error'], "couldn't fetch intra user data")


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

def gen_jwt_token(username, type, exp_mins, id):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=exp_mins)
    exp_unix_timestamp = int(expiration_time.timestamp())
    encoded_jwt = jwt.encode({
                                "username": username,
                                "id": id,
                                "exp": exp_unix_timestamp,
                                "type": type,
                            }, os.environ['secret_pass'], algorithm="HS256")
    return encoded_jwt.decode('utf-8')  

if __name__ == '__main__':
    unittest.main()




