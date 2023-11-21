from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import requests
import os

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
        data = json.loads(request.body)
        code  = data.get('code')
        if not code:
            return JsonResponse({'error': 'Intra authentication failed'}, status=400)
        try:
            url = "https://api.intra.42.fr/oauth/token"
            data = {
                'grant_type': 'authorization_code',
                'client_id': os.getenv('intra_client_id'),
                'client_secret': os.getenv('intra_client_secret'),
                'code': code,
                'redirect_uri': 'http://localhost:3000/auth',
            }
            response = requests.post(url, data=data)

            if response.status_code != 200:
                print("response:", response.json()) 
                print("Access Token:", response.json()['access_token'])

                bearer_token =  "Bearer " +response.json()['access_token']
                headers = {
                    "Authorization":  bearer_token,
                }
                url = "https://api.intra.42.fr/v2/me"
                response = requests.get(url, headers=headers)
                username = response.json()['email']
                password = os.getenv('secret_pass')
                if not username:
                    return JsonResponse({'message': response.json()['access_token']}, status=500)

                print("\n\n")
                if response.status_code == 200:
                    print(f"\n\nrecieved email = {username}")
                    if User.objects.filter(username=username).exists():
                        user = authenticate(request, username=username, password=password)
                        if user is not None:
                            login(request, user)
                            print(f"Successful login via intra {username} finally Alhamdolelah")
                            print(f"Successful login via intra {response.json()} finally Alhamdolelah")
                            return JsonResponse({'message': username })
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        user = authenticate(request, username=username, password=password)
                        if user is not None:
                            login(request, user)
                            return JsonResponse({'message': username + 'Login Successful'})
                    return JsonResponse({'error': "couldn't register or login " + response.json()['email']})
                else:
                    print(f"Recieved error in the second call {response.status_code}");
                return JsonResponse({'message': response.json()['access_token']}, status=500)
            else:
                print(f"error code {response.status_code}")
        except Exception as e:
            print(f"error {e}")
            return JsonResponse({'error': f"Internal server error"}, status=500)
    return JsonResponse({'error': "Internal server error"}, status=500)
