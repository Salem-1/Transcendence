from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from .models import User_2fa
from.logout import generate_password, decrypt_string, decode_base64url
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_POST
import jwt
import json
import requests
import os
import re 
import datetime

def get_user_id(username):
    try:
        user = User.objects.get(username=username)
        user_id = user.id
        return user_id
    except User.DoesNotExist:
        return None

def fetch_auth_token(url_auth_code):
    url = "https://api.intra.42.fr/oauth/token"
    print(f"clientid={os.getenv('INTRA_CLIENT_ID')}\nclient_secret={os.getenv('INTRA_CLIENT_SECRET')}")
    data = {
        'grant_type': 'authorization_code',
        'client_id': os.getenv('INTRA_CLIENT_ID'),
        'client_secret': os.getenv('INTRA_CLIENT_SECRET'),
        'code': url_auth_code,
        'redirect_uri': 'http://localhost:3000/auth',
    }
    return requests.post(url, data=data)

def fetch_intra_user_data(response):
    bearer_token =  "Bearer " +response.json()['access_token']
    headers = {
        "Authorization":  bearer_token,
    }
    url = "https://api.intra.42.fr/v2/me"
    return requests.get(url, headers=headers)

def login_intra_user(request, username):
    user = authenticate(request, username=username, password=os.getenv('SECRET_PASS'))
    if user is not None:
        login(request, user)
        return True
    return False

def create_intra_user(username):
    if not username or username == "" or os.getenv('SECRET_PASS') == "":
        return False
    user = User.objects.create_user(username=username, password=os.getenv('SECRET_PASS'))
    user.save()
    user_2fa = User_2fa.objects.create(user=user)
    user_2fa.jwt_secret = generate_password(13)
    user_2fa.save()
    return True
    
def is_valid_input(username, password, data):
    if len(data) != 2:
        return False, JsonResponse({'error': 'Bad request body'}, status=400)
    if not username or username == "":
        return False, JsonResponse({'error': 'Username cannot be empty'}, status=400)
    if has_special_characters(username) != None:
        return False, JsonResponse({'error': 'username cannot contain special characters'}, status=400)
    if len(password) < 8:
        return False, JsonResponse({'error': 'Passwords too short, should be 8 characters at least'}, status=400)
    if not has_alphanumeric(password):
        return False, JsonResponse({'error': 'password must contain upper, lower case letter and number'}, status=400)
    return True, ""

def has_alphanumeric(password):
    numeric = re.search(r"([0-9])", password)
    lower = re.search(r"([a-z])", password)
    upper = re.search("([A-Z])", password)
    return all((numeric, upper, lower))

def has_special_characters(username):
    special_characters = r'[!@#$%^&*(),.;?":{}|<>\'\s]'
    return re.search(special_characters, username)

def gen_jwt_token(username, type, exp_mins):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=exp_mins)
    exp_unix_timestamp = int(expiration_time.timestamp())
    encoded_jwt = jwt.encode({
                                "username": username,
                                "id": get_user_id(username),
                                "exp": exp_unix_timestamp,
                                "type": type,
                            }, os.environ['SECRET_PASS'] + get_jwt_secret(username), algorithm="HS256")
    return encoded_jwt.decode('utf-8')  

def tokenize_login_response(username):
    encoded_jwt = gen_jwt_token(username, "Bearer",  120)  
    refresh_jwt = gen_jwt_token(username, "Refresh",240)  
    response_data = {
        'jwt_token': encoded_jwt,
        'refresh-token': refresh_jwt,
        'username': username,
        }
    json_response = json.dumps(response_data)
    return HttpResponse(
                json_response,
                status=200,
                content_type="application/json"
                )

def get_user_id(username):
    try:
        user = User.objects.get(username=username)
        user_id = user.id
        return user_id
    except User.DoesNotExist:
        return None

def ready_packet(body, status_code=200):
    json_response = json.dumps(body)
    return HttpResponse(
                json_response,
                status=status_code,
                content_type="application/json"
                )

def validate_jwt(request):
    expiration_time = datetime.datetime.utcnow()
    current_unix_timestamp = int(expiration_time.timestamp())
    jwt_token = request.COOKIES.get('Authorization')
    if jwt_token and jwt_token.startswith('Bearer '):
        jwt_token = jwt_token.split('Bearer ')[1]
        user_jwt_secret = get_user_jwt_secret(jwt_token)
        decode_token = jwt.decode(
                        jwt_token, 
                        os.environ['SECRET_PASS'] + user_jwt_secret , 
                        algorithms=['HS256']
                    )
        if (decode_token['exp'] > current_unix_timestamp):
            return decode_token
    raise jwt.exceptions.InvalidTokenError()

def get_user_jwt_secret(jwt_token):
    try:
        payload = jwt_token.split(".")
        user_data = json.loads(decode_base64url(payload[1]))
    except Exception as e:
        print(f"\n {e}\n")
    return get_jwt_secret(user_data["username"])

def get_jwt_secret(given_username):
    try:
        user = User.objects.get(username=given_username)
        user_2fa = User_2fa.objects.get(user=user)
        secret = decrypt_string(user_2fa.jwt_secret)
        return secret
    except Exception as e:
        return user_2fa.jwt_secret
    