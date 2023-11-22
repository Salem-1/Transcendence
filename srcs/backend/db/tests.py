from django.test import TestCase, Client
from django.contrib.auth.models import User
import json

class YourAppViewsTest(TestCase):
    def setUp(self):
        # Create a test user
        self.test_user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a Django test client
        self.client = Client()

    def test_register_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'message': 'Registration successful'})

        # Test registration with an existing username
        response = self.client.post('/register/', json.dumps({'username': 'testuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Username already taken'})
    
    def test_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': '', 'password': 'newpassword'}), content_type='application/json')
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
    
    def test_lgoin_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'message': 'newuser'})
    
    def test_lgoin_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': '', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})
    
    def test_lgoin_empty_user(self):
        # Test registration with a new username
        response = self.client.post('/register/', json.dumps({'username': 'newuser', 'password': 'newpassword'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.post('/login/', json.dumps({'username': 'newuser', 'password': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertJSONEqual(str(response.content, encoding='utf-8'), {'error': 'Invalid request username or password'})
    
    def test_intra_auth(self):
        # Test registration with a new username
        response = self.client.post('/auth/', json.dumps({'code': 'generate code for this test'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        

