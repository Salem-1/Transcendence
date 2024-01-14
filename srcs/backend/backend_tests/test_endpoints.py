import unittest
import requests
import json
import jwt
import os
import random
import string
import datetime
import warnings
import random
import string
import pyotp
import base64
warnings.filterwarnings("ignore")



base_url = 'http://localhost:8000' 

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
    base_url = 'http://localhost:8000'  # Update with your actual base URL

    def setUp(self):
        # Create a test user
        username , password = "TESTuser12", "TESTuser12"
        self.test_user = {'username': username, 'password': password}
        username , password = "TESTuser122", "TESTuser122"
        self.otp_user = {'username': username , 'password': password}


    def test_register_initial_user(self):
        # Test registration with a new username
        request_data = {'username': self.test_user["username"], 'password': self.test_user["password"]}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Username already taken')
        request_data = {'username': self.otp_user["username"], 'password': self.otp_user["password"]}
        response = requests.post(f'{self.base_url}/register/', json=request_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Username already taken')

    def test_send_otp(self):
        response = requests.get(f'{self.base_url}/test_send_otp/')
        self.assertEqual(response.status_code, 200);
    
    def test_expired_jwt(self):
        login_data = {'username': self.test_user['username'], 'password': self.test_user['password']}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        self.assertEqual(login_response.status_code, 200)
        
        jwt_token = login_response.json().get('jwt_token')
        jwt_token = jwt.decode(jwt_token, os.environ['SECRET_PASS'], algorithms=['HS256'])
        exp_jwt_token = gen_jwt_token(self.test_user['username'], jwt_token['type'], 0, jwt_token['id'])
        headers = {'Cookie': f'Authorization=Bearer {exp_jwt_token}'}
        response = requests.get(f'{self.base_url}/username/', headers=headers)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], "Invalid Authorization token")



    def test_enable2FA(self):
        login_data = {'username': self.otp_user["username"], 'password': self.otp_user["password"]}
        login_response = requests.post(f'{self.base_url}/login/', json=login_data)
        # self.assertEqual(login_response.status_code, 200)
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        #enable 2fa request
        request_data = {"enable2fa": "true"}
        response = requests.post(f'{self.base_url}/set_2fa/', json=request_data, headers=headers)
        # self.assertEqual(response.status_code, 200)

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
        request_data = {'username': randomize_string(8), 'password': 'newpassA0word', "malicous": r"0x\4\4\4\df"}
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
        jwt_token = f"{login_response.json().get('jwt_token')}spoof"

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


    def test_validate_2fa_email(self):
        user = gen_username()
        login_response = registe_and_login_user(user, self.test_user["password"])
        self.assertEqual(login_response.status_code, 200)

        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        request_data = {"enable2fa": "true"}
        get_response = requests.get(f'{self.base_url}/submit_2fa_email/', json=request_data, headers=headers)
        self.assertEqual(get_response.status_code, 405)

        post_response = requests.post(f'{self.base_url}/submit_2fa_email/', json=request_data, headers=headers)
        self.assertEqual(post_response.status_code, 400)
        #invalid jwt token
        self.assertEqual(register_email_in_2fa("email@example.com", self.base_url, headers="").status_code, 401)
        #invalid jwt emial
        self.assertEqual(register_email_in_2fa("email@example.com", self.base_url, headers).status_code, 202)
        self.assertEqual(register_email_in_2fa("", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@.", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("@b.x", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x'--", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x#", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x$", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x$%", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x&", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x*", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x(", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b.x)", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("a@b!.x)", self.base_url, headers).status_code, 400)
        self.assertEqual(register_email_in_2fa("ajdfblkfjesnflkjgnfdslkjnlkjsdfnblkjbadsflkjbflksadjbflkjdsblkjhfblkahjsdbkjhfbaskjhfbkjahsbfkjhasbdkjfhbaskjhdfbjkahsbfkjhasba@b.x)", self.base_url, headers).status_code, 400)
        #valid email
        self.assertEqual(register_email_in_2fa("pong@null.net", self.base_url, headers).status_code, 202)
        self.assertEqual(register_email_in_2fa("thereisnowaysomeonehasthisemail@null.netdsfkjgbsdlf", self.base_url, headers).status_code, 202)
    
    def test_submit_2fa_email(self):
        user = gen_username()
        login_response = registe_and_login_user(user, self.test_user["password"])
        self.assertEqual(login_response.status_code, 200)
        jwt_token = login_response.json().get('jwt_token')
        headers = {'Cookie': f'Authorization=Bearer {jwt_token}'}
        request_data = {"enable2fa": "true"}
        self.assertEqual(register_email_in_2fa("email@example.com", self.base_url, headers).status_code, 202)
        response = register_email_in_2fa("email@example.com", self.base_url, headers)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()["message"], "One time password sent to your email")
        
        # data = {"otp": "23423", "email": "pong@null.net"}
        # response  = requests.post(f'{base_url}/enable_2fa_email/', json=data, headers=headers)
        # self.assertEqual(response.status_code, 401);
        
        # data = {"otp": generate_otp(generate_otp_secret(user)), "email": "pong@null.net"}
        # response  = requests.post(f'{base_url}/enable_2fa_email/', json=data, headers=headers)
        # self.assertEqual(response.status_code, 202);

    def test_enable_enabled_already_2fa(self):
        pass




def generate_otp(secret):
    totp = pyotp.TOTP(secret)
    return totp.now()

def generate_otp_secret(username):
    return (base64.b32encode(username.encode('utf-8')).decode('utf-8'))


def register_email_in_2fa(email, base_url, headers):
    request_email = {"email": email}
    return requests.post(f'{base_url}/submit_2fa_email/', json=request_email, headers=headers)

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
    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=exp_mins)

    exp_unix_timestamp = int(expiration_time.timestamp())
    encoded_jwt = jwt.encode({
                                "username": username,
                                "id": id,
                                "exp": exp_unix_timestamp,
                                "type": type,
                            }, os.environ['SECRET_PASS'], algorithm="HS256")
    return encoded_jwt


warnings.resetwarnings()

if __name__ == '__main__':
    unittest.main()




