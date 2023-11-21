from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import requests
import os
from db.views_utils import fetch_auth_token, fetch_intra_user_data, login_intra_user, create_intra_user


@csrf_exempt
def register_user(request):
    if request.method =='POST':
        try:
            data = json.loads(request.body)
            username  = data.get('username')
            password  = data.get('password')
            if not username or username == "":
                return JsonResponse({'error': 'Username cannot be empty'}, status=400)
            elif len(password) < 8:
                return JsonResponse({'error': 'Passwords too short, should be 8 cahr at leaset'}, status=400)
            elif User.objects.filter(username=username).exists():
                return JsonResponse({'error': "Username already taken"}, status=400)

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
        print(f"username {username}, {password}");
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': username})
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
                return JsonResponse({'error': "couldn't register or login "})
            intra_user_data_response = fetch_intra_user_data(auth_token_response)
            username = intra_user_data_response.json()['email']
            if intra_user_data_response.status_code == 200:
                if (User.objects.filter(username=username).exists()\
                            and login_intra_user(request, username)) \
                    or (create_intra_user(username) \
                            and login_intra_user(request, username)):
                    return JsonResponse({'message': username })
                return JsonResponse({'error': "couldn't register or login!"})
        except Exception as e:
            return JsonResponse({'error': f"Internal server error"}, status=500)
    return JsonResponse({'error': "Internal server error"}, status=500)