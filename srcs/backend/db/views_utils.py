from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import requests
import os


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
    user = authenticate(request, username=username, password=os.getenv('secret_pass'))
    if user is not None:
        login(request, user)
        return True
    return False

def create_intra_user(username):
    if not username or username == "" or os.getenv('secret_pass') == "":
        return False
    user = User.objects.create_user(username=username, password=os.getenv('secret_pass'))
    return True
    
# # @csrf_exempt
# # def auth_intras(request):
# #     if request.method =='POST':
# #         data = json.loads(request.body)
# #         code  = data.get('code')
# #         if not code:
# #             return JsonResponse({'error': 'Intra authentication failed'}, status=400)
# # #        try:
#                url = "https://api.intra.42.fr/oauth/token"
#                data = {
#                    'grant_type': 'authorization_code',
#                    'client_id': os.getenv('intra_client_id'),
#                    'client_secret': os.getenv('intra_client_secret'),
#                    'code': code,
#                    'redirect_uri': 'http://localhost:3000/auth',
#                }
#               r esponse =  requests.post(url, data=data)
# #             if response.status_code != 200:
# #                 bearer_token =  "Bearer " +response.json()['access_token']
# #                 headers = {
# #                     "Authorization":  bearer_token,
# #                 }
# #                 url = "https://api.intra.42.fr/v2/me"
# #                 response = requests.get(url, headers=headers)
# #                 username = response.json()['email']
# #                 password = os.getenv('secret_pass')
# #                 if not username:
# #                     return JsonResponse({'message': response.json()['access_token']}, status=500)
# #                 if response.status_code == 200:
# #                     if User.objects.filter(username=username).exists():
# #                         user = authenticate(request, username=username, password=password)
# #                         if user is not None:
# #                             login(request, user)
# #                             return JsonResponse({'message': username })
# #                     else:
# #                         user = User.objects.create_user(username=username, password=password)
# #                         user = authenticate(request, username=username, password=password)
# #                         if user is not None:
# #                             login(request, user)
# #                             return JsonResponse({'message': username + 'Login Successful'})
# #                     return JsonResponse({'error': "couldn't register or login " + response.json()['email']})
# #                 else:
# #                     print(f"Recieved error in the second call {response.status_code}");
# #                 return JsonResponse({'message': response.json()['access_token']}, status=500)
# #             else:
# #                 print(f"error code {response.status_code}")
# #         except Exception as e:
# #             print(f"error {e}")
# #             return JsonResponse({'error': f"Internal server error"}, status=500)
# #     return JsonResponse({'error': "Internal server error"}, status=500)
