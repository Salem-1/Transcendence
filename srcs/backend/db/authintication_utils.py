from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
# from .models import User_2fa
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
    data = {
        'grant_type': 'authorization_code',
        'client_id': os.getenv('intra_client_id'),
        'client_secret': os.getenv('intra_client_secret'),
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
                            }, os.environ['SECRET_PASS'], algorithm="HS256")
    return encoded_jwt.decode('utf-8')  

def tokenize_login_response(username):
    encoded_jwt = gen_jwt_token(username, "Bearer",  2)  
    refresh_jwt = gen_jwt_token(username, "Refresh",10)  
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
        decode_token = jwt.decode(jwt_token, os.environ['SECRET_PASS'], algorithms=['HS256'])
        if (decode_token['exp'] > current_unix_timestamp):
            return decode_token
        print("expired token")
    raise jwt.exceptions.InvalidTokenError()