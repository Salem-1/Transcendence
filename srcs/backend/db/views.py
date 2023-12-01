from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from .double_factor_authenticate import is_2fa_enabled, authenticate_otp_page, fetch_otp_secret, verify_OTP
import json
import jwt
import requests
import os
from db.authintication_utils import fetch_auth_token, fetch_intra_user_data, login_intra_user, create_intra_user, is_valid_input, tokenize_login_response

@csrf_exempt
def register_user(request):
    if request.method =='POST':
        try:
            data = json.loads(request.body)
            username  = data.get('username')
            password  = data.get('password')
            valid_input, error_message = is_valid_input(username, password);
            if not valid_input:
                return error_message

            user = User.objects.create_user(username=username, password=password)
            return JsonResponse({'message': "Registration successful"})
        except Exception as e:
            return JsonResponse({'error': "Internal server error"}, status=500)  
    return JsonResponse({}, status=400)  

@csrf_exempt
def login_user(request):
    if request.method =='POST':
        data = json.loads(request.body)
        username  = data.get('username')
        password  = data.get('password')
        user = authenticate(request, username=username, password=password)
        user_data = User.objects.get(username=username) 
        if user is not None:
            if is_2fa_enabled(user_data):
                return authenticate_otp_page(username)
                #2fA_authenticate()
            login(request, user)
            return tokenize_login_response(username)
        else:
            return JsonResponse({'error': 'Invalid request username or password'}, status=401)
    return JsonResponse({}, status=400)  

@csrf_exempt
def auth_intra(request):
    if request.method =='POST':
        try:
            request_body = json.loads(request.body)
            url_auth_code  = request_body.get('code')
            auth_token_response = fetch_auth_token(url_auth_code)
            if auth_token_response.status_code != 200:
                return JsonResponse({'error': "couldn't fetch intra user data"}, status=400)
            intra_user_data_response = fetch_intra_user_data(auth_token_response)
            username = intra_user_data_response.json()['email']
            if intra_user_data_response.status_code == 200:        
                if (User.objects.filter(username=username).exists() \
                            and login_intra_user(request, username)) \
                    or (create_intra_user(username) \
                            and login_intra_user(request, username)):
                    return  tokenize_login_response(username)
                return JsonResponse({'error': "couldn't register or login!"}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Internal server error"}, status=500)
    return JsonResponse({'error': "Internal server error"}, status=500)


@csrf_exempt
def fetch_username(request):
    try:
        jwt_token = request.COOKIES.get('Authorization')
        if jwt_token and jwt_token.startswith('Bearer '):
            jwt_token = jwt_token.split('Bearer ')[1]
            decoded_payload = jwt.decode(jwt_token, os.environ['secret_pass'], algorithms=['HS256'])
            print(f"fetched username {decoded_payload}")
            user_id = decoded_payload.get('id')
            user = User.objects.get(id=user_id)
            fetched_username = user.username
            return JsonResponse({"username": fetched_username, "id": user_id})
        else:
            raise ValueError("Invalid or missing Authorization header")
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"error": "Invalid or missing token"}, status=401)

@csrf_exempt
def double_factor_auth(request):
    if request.method == "POST":
        try:
            jwt_token = request.COOKIES.get('Authorization')
            print(f"requst for auth recieved {jwt_token}")
            if jwt_token and jwt_token.startswith('Bearer '):
                jwt_token = jwt_token.split('Bearer ')[1]
                decoded_payload = jwt.decode(jwt_token, os.environ['secret_pass'], algorithms=['HS256'])
                token_type = decoded_payload.get('type')
                username = decoded_payload.get('username')
                request_body = json.loads(request.body)
                otp = request_body.get("otp")
                secret = fetch_otp_secret(username)
                print(secret)
                if verify_OTP(secret, otp):
                    return tokenize_login_response(username)
                else:
                    return JsonResponse({"error": "Invalid OTP"}, status=401)
            else:
                raise ValueError("Invalid or missing Authorization header")
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"error": "Invalid or missing token"}, status=401)
    return JsonResponse({'error': "Method not allowed"}, status=405)
    
    ##
    response_data = {
        "auth": "true"
        }
    json_response = json.dumps(response_data)
    return HttpResponse(
                json_response,
                status=302,
                content_type="application/json"
                )
    
# import pyotp
# import time

# totp = pyotp.TOTP('base32secret3232')
# totp.now() # => '492039'