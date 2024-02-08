# from django.test import TestCase, Client
import unittest
# from django.contrib.auth.models import  User
import json
import os
from .authintication_utils import fetch_auth_token, fetch_intra_user_data, login_intra_user, create_intra_user, is_valid_input, tokenize_login_response, get_jwt_secret
from .double_factor_authenticate import authenticate_otp_redirect
from .logout import generate_password, generate_encrypted_secret, decrypt_string, encrypt_string
from .send_otp import send_otp_email
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import User_2fa
# from models import get_user_id
import jwt
import requests
import re 
import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from web3 import Web3, Account

from .smart_contract import connect_to_w3

class YourAppViewsTest(unittest.TestCase):
    # def setUp(self):
    #     # Create a test user
    #     self.test_user = User.objects.create_user(username='testuser', password='testpassword')
    #     # self.test_user = {'username': 'testuser', 'password': 'testpassword'}
    #     pass
    #     # Create a Django test client
    #     # self.client = Client()
    def connect_to_w3():
        w3 = connect_to_w3()
#         network_id = w3.net.version 
# print(f"Connected to network with ID: {network_id}")
        # network_id
    def test_authenticate_otp_redirect(self):
            # Get  current time
            current_time = datetime.datetime.utcnow()
            username = 'testuser'
            password = generate_password(13)
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, password=password)
                user.save()
                user_2fa = User_2fa.objects.create(user=user)
                user_2fa.jwt_secret = generate_password(13)
                user_2fa.save()
            response = authenticate_otp_redirect(username)
            json_response = json.loads(response.content.decode('utf-8'))

            # Decode the JWT token and verify its claims
            decoded_token = jwt.decode(json_response['jwt_token'], os.environ['SECRET_PASS'] + get_jwt_secret(username), algorithms=['HS256'])
            self.assertEqual(decoded_token['username'], username)
            self.assertEqual(decoded_token['type'], 'otp')

            # Check the expiration time (exp claim)
            expiration_time = decoded_token['exp']
            expected_expiration_time = int((current_time + datetime.timedelta(minutes=1)).timestamp())
            self.assertEqual(expiration_time, expected_expiration_time)

            # Check other properties in the response
            self.assertEqual(json_response['username'], username)
            self.assertEqual(json_response['type'], 'otp')
            self.assertEqual(response.status_code, 302)
            self.assertEqual(response['content-type'], 'application/json')


    def test_is_valid_input_valid_data(self):
        username = 'validuser'
        password = 'validpassworD3d'
        data = {'username': username, 'password': password}
        result, response = is_valid_input(username, password, data)
        self.assertTrue(result)
  

    def test_is_valid_input_empty_username(self):
        username = ''
        password = 'validpassword'
        data = {'username': username, 'password': password}
        result, response = is_valid_input(username, password, data)
        self.assertFalse(result)
        self.assertEqual(response.status_code, 400)

    def test_empty_password(self):
        username = 'USerfe'
        password = ''
        data = {'username': username, 'password': password}
        result, response = is_valid_input(username, password, data)
        self.assertFalse(result)
        self.assertEqual(response.status_code, 400)

    def test_is_valid_input_special_characters_username(self):
        username = 'user!@#'
        password = 'validpassword'
        data = {'username': username, 'password': password}
        result, response = is_valid_input(username, password, data)
        self.assertFalse(result)
        self.assertEqual(response.status_code, 400)

    def test_generate_secret(self):
         self.assertEqual(len(generate_password()), 13)
         for i in range(1, 35):
            self.assertEqual(len(generate_password(i)), i)

    def test_generate_encrypted_secret(self):
         self.assertEqual(len(decrypt_string(generate_encrypted_secret())), 13)
         for i in range(1, 35):
            self.assertEqual(len(decrypt_string(generate_encrypted_secret(i))), i)

    # def gen_jwt_token(username, type, exp_mins, id):
    #     expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=exp_mins)

    #     exp_unix_timestamp = int(expiration_time.timestamp())
    #     encoded_jwt = jwt.encode({
    #                                 "username": username,
    #                                 "id": id,
    #                                 "exp": exp_unix_timestamp,
    #                                 "type": type,
    #                             }, os.environ['SECRET_PASS'], algorithm="HS256")
    #     return encoded_jwt   
    #     # Test registration with an existing username
    #     response = self.client.post('/register/', json.dumps({'username': 'testuser', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Username already taken'})
    
    # def test_empty_user(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': '', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Username cannot be empty'})

    # def test_register_empty_pass(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': ''}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Passwords too short, should be 8 cahr at leaset'})
    
    # def test_register_short_pass(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': '1234567'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Passwords too short, should be 8 cahr at leaset'})
    
    # def test_login_user(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     json_response = json.loads(str(response.content, encoding='utf-8'))
    #     self.assertEqual(json_response['username'], 'newuser')
    
    # def test_lgoin_empty_user(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     response = self.client.post('/login/', json.dumps({'username': '', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 401)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})
    
    # def test_lgoin_empty_user(self):
    #     # Test registration with a new username
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': ''}), content_type='application/json')
    #     self.assertEqual(response.status_code, 401)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})

    # def test_register_user_non_alphanum_pass(self):
    #     response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'password must contain upper, lower case letter and number'})
    
    # def test_register_malicous_user(self):
    #     response = self.client.post('/register/', json.dumps({'username': "newuser'---", 'password': 'newA0password'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'username cannot contain special characters'})

    # def test_login_invalid_request_method(self):
    #     # Test login with an invalid request method
    #     response = self.client.get('/login/')
    #     self.assertEqual(response.status_code, 400)
    #     self.assertNotIn('Authorization', response)
    
    # def test_login_tokenized_jwt(self):
    #     # Test login with valid credentials
    #     credentials = {'username': 'testuser', 'password': 'testpassword'}
    #     response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     json_response = json.loads(str(response.content, encoding='utf-8'))
    #     token = json_response['jwt_token']
    #     decoded_payload = jwt.decode(token, os.environ['SECRET_PASS'], algorithms=['HS256'])
    #     self.assertEqual(decoded_payload['username'], 'testuser')

    # def test_login_invalid_credentials(self):
    #     # Test login with invalid credentials
    #     credentials = {'username': 'testuser', 'password': 'wrongpassword'}
    #     response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
    #     self.assertEqual(response.status_code, 401)
    #     self.assertNotIn('Authorization', response)




    # def test_fetch_username(self):
    #     credentials = {'username': 'testuser', 'password': 'testpassword'}
    #     response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     response_data = json.loads(str(response.content, encoding='utf-8'))
    #     jwt_token = response_data['jwt_token']
    #     self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_token}')
    #     fetching_response = self.client.get('/username/', content_type='application/json')
    #     json_response = fetching_response.json()
    #     self.assertEqual(json_response["username"], 'testuser')

    # def test_spoofed_token(self):
    #     credentials = {'username': 'testuser', 'password': 'testpassword'}
    #     response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     response_data = json.loads(str(response.content, encoding='utf-8'))
    #     jwt_token = response_data['jwt_token'] + 'a'
    #     self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {jwt_token}')
    #     fetching_response = self.client.get('/username/', content_type='application/json')
    #     self.assertEqual(fetching_response.status_code, 401)
    #     json_response = fetching_response.json()
    #     self.assertEqual(json_response["error"], 'Invalid or missing token')