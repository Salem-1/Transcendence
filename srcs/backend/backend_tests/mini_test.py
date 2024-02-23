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
import hvac
import os 

    
def get_secret(key):
    client = hvac.Client(
    url='http://vault:8200',
    token= os.environ.get('VAULT_TOKEN_KEY')
    )
    read_response = client.secrets.kv.read_secret_version(path='secret/'+ key)
    return read_response['data']['data']['key']
    

# Suppress all warnings
warnings.filterwarnings("ignore")
base_url = 'http://localhost:443/api'

username_g , password_g = randomize_string(8), randomize_string(8)
def gen_username():
    return  ''.join(random.choice(string.ascii_letters) for _ in range(8))

def register_user(name, password):
    request_data = {'username': name, 'password': password}
    response = requests.post(f'{base_url}/register/', json=request_data)
    return response

def login_user(name, password):
    request_data = {'username': name, 'password': password}
    response = requests.post(f'{base_url}/login/', json=request_data)
    return response

def registe_and_login_user(name, password):
    register_user(name, password)
    return login_user(name, password)
class YourAppViewsTest(unittest.TestCase):
    base_url = 'http://localhost:443/api'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = username_g , password_g 
        self.test_user = {'username': username, 'password': password}
        request_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        # response = requests.post(f'{self.base_url}/register/', json=request_data)
        # self.assertEqual(response.status_code, 200)


    # def test_get_secret(self):
    #     self.assertEqual(get_secret("TEST"), "test")
    
    # def test_set_winner(self):
    #     response  = registe_and_login_user(gen_username(), self.test_user["password"])
    #     self.assertEqual(response.status_code, 200)
    #     jwt_token = response.json().get('jwt_token')
    #     headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
    #     # data = {"otp": generate_otp(generate_otp_secret(user)), "email": "pong42abudhabi@gmail.com"}
    #     data = {"winner": "Jaafar"}
    #     response  = requests.post(f'{base_url}/set_winner/', json=data, headers=headers)
    #     self.assertEqual(response.status_code, 200)
    #     data = {"winner": "35324"}
    #     response  = requests.post(f'{base_url}/set_winner/', json=data, headers=headers)
    #     self.assertEqual(response.status_code, 401)
    #     data = {"winner": ""}
    #     response  = requests.post(f'{base_url}/set_winner/', json=data, headers=headers)
    #     self.assertEqual(response.status_code, 401)
    #     response  = requests.post(f'{base_url}/set_winner/', json=data)
    #     self.assertEqual(response.status_code, 401)
    #     response  = requests.get(f'{base_url}/set_winner/', json=data, headers=headers)
    #     self.assertEqual(response.status_code, 405)

    def test_get_all_winners(self):
        response  = registe_and_login_user(gen_username(), self.test_user["password"])
        self.assertEqual(response.status_code, 200)
        jwt_token = response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        response  = requests.get(f'{base_url}/get_winners/', headers=headers)
        winners = response.json().get("winners")
        #print(winners)
        self.assertEqual(response.status_code, 200)
        response  = requests.post(f'{base_url}/get_winners/', headers=headers)
        self.assertEqual(response.status_code, 405)



    #     #fetch username failuer

if __name__ == '__main__':
    unittest.main()
