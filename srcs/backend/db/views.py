from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json


@csrf_exempt
def register_user(request):
    print("register user called")
    if request.method =='POST':
        data = json.loads(request.body)
        username  = data.get('username')
        password  = data.get('password')
        print(f"post request recieved regestring username={username} pass={password}")
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': "Username already taken"}, status=400)
        
        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({'message': "Registration successful"})
    
    return JsonResponse({}, status=400)  

@csrf_exempt
def login_user(request):
    print("register user called")
    if request.method =='POST':
        data = json.loads(request.body)
        username  = data.get('username')
        password  = data.get('password')
        print(f"post request recieved loggin in username={username} pass={password}")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login Successful'})
        else:
            return JsonResponse({'error': 'Invalid request username or password'}, status=401)
    return JsonResponse({}, status=400)  
