from django.test import TestCase, Client
from django.contrib.auth.models import  User
import json
import jwt
import os
class YourAppViewsTest(TestCase):
    def setUp(self):
        # Create a test user
        self.test_user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a Django test client
        self.client = Client()

    def test_register_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'message': 'Registration successful'})

        # Test registration with an existing username
        response = self.client.post('/register/', json.dumps({'username': 'testuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Username already taken'})
    
    def test_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': '', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Username cannot be empty'})

    def test_register_empty_pass(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Passwords too short, should be 8 cahr at leaset'})
    
    def test_register_short_pass(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': '1234567'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Passwords too short, should be 8 cahr at leaset'})
    
    def test_login_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        json_response = json.loads(str(response.content, encoding='utf-8'))
        self.assertEqual(json_response['username'], 'newuser')
    
    def test_lgoin_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': '', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})
    
    def test_lgoin_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassA0word'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})

    def test_register_user_non_alphanum_pass(self):
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'password must contain upper, lower case letter and number'})
    
    def test_register_malicous_user(self):
        response = self.client.post('/register/', json.dumps({'username': "newuser'---", 'password': 'newA0password'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'username cannot contain special characters'})

    def test_login_invalid_request_method(self):
        # Test login with an invalid request method
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 400)
        self.assertNotIn('Authorization', response)
    
    def test_login_tokenized_jwt(self):
        # Test login with valid credentials
        credentials = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        json_response = json.loads(str(response.content, encoding='utf-8'))
        token = json_response['jwt_token']
        decoded_payload = jwt.decode(token, os.environ['secret_pass'], algorithms=['HS256'])
        self.assertEqual(decoded_payload['username'], 'testuser')

    def test_login_invalid_credentials(self):
        # Test login with invalid credentials
        credentials = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post('/login/', json.dumps(credentials), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertNotIn('Authorization', response)




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