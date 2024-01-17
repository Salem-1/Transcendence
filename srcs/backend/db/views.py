from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from .double_factor_authenticate import is_2fa_enabled, authenticate_otp_redirect, generate_otp_secret, verify_OTP,  generate_otp
import json
import jwt
import requests
import os
from db.authintication_utils import fetch_auth_token, fetch_intra_user_data, login_intra_user, create_intra_user, is_valid_input, tokenize_login_response, validate_jwt
from .models import User_2fa
from .send_otp import send_otp_email, not_valid_email, send_smtp_email
from django.core.mail import EmailMessage

@csrf_exempt
def register_user(request):
    if request.method =='POST':
        try:
            data = json.loads(request.body)
            username  = data.get('username')
            password  = data.get('password')
            valid_input, error_message = is_valid_input(username, password, data);
            if not valid_input:
                return error_message
            elif User.objects.filter(username=username).exists():
                return JsonResponse({'error': "Username already taken"}, status=400)
            user = User.objects.create_user(username=username, password=password)
            return JsonResponse({'message': "Registration successful"})
        except Exception as e:
            return JsonResponse({'error': "Internal server error"}, status=500)  
    return JsonResponse({'error': "Method not allowed"}, status=405)  

@csrf_exempt
def login_user(request):
    if request.method =='POST':
        try:
            data = json.loads(request.body)
            username  = data.get('username')
            password  = data.get('password')
            valid_input, error_message = is_valid_input(username, password, data)
            if not valid_input:
                return error_message
            user = authenticate(request, username=username, password=password)
            if user is not None:
                user_data = User.objects.get(username=username) 
                if is_2fa_enabled(user_data):
                    send_otp_email(user_data.email, generate_otp(User_2fa.objects.get(user=user).two_factor_secret))
                    return authenticate_otp_redirect(username)
                login(request, user)
                return tokenize_login_response(username)
            else:
                return JsonResponse({'error': 'Invalid request username or password'}, status=401)
        except Exception as e:    
            return JsonResponse({"error": "Internal server error while login"}, status=500)  
    return JsonResponse({"error": "Method not allowed"}, status=405)  

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
                    user_data = User.objects.get(username=username)
                    if is_2fa_enabled(user_data):
                        return authenticate_otp_redirect(username)
                    return  tokenize_login_response(username)
                return JsonResponse({'error': "couldn't register or login!"}, status=400)
        except Exception as e:  
            return JsonResponse({'error': f"Internal server error couldn't login with intra {e}"}, status=500)
    return JsonResponse({'error': "Internal server error"}, status=500)

@csrf_exempt
def fetch_username(request):
    try:
        decoded_payload = validate_jwt(request)
        if decoded_payload['type'] != 'Bearer':
            raise jwt.exceptions.InvalidTokenError()
        user_id = decoded_payload.get('id')
        user = User.objects.get(id=user_id)
        fetched_username = user.username
        return JsonResponse({"username": fetched_username, "id": user_id})
    except Exception as e:
        return JsonResponse({"error": "Invalid Authorization token"}, status=401)

@csrf_exempt
def login_verf(request):
    try:
        decoded_payload = validate_jwt(request)
        if decoded_payload['type'] != 'Bearer':
            raise jwt.exceptions.InvalidTokenError()
        return JsonResponse({"message": "valid token"})
    except Exception as e:
        return JsonResponse({"error": "Invalid Authorization token"}, status=401)

@csrf_exempt
def not_logged_in(request):
    try:
        decoded_payload = validate_jwt(request)
        if decoded_payload['type'] != 'Bearer':
            raise jwt.exceptions.InvalidTokenError()
        return JsonResponse({"error": "valid token"}, status=401)
    except Exception as e:
        return JsonResponse({"message": "Not Logged In"})


    

@csrf_exempt
def double_factor_auth(request):
    if request.method == "POST":
        try:
            decoded_payload = validate_jwt(request)
            if decoded_payload.get('type') != 'otp':
                raise jwt.exceptions.InvalidTokenError()
            username = decoded_payload.get('username')
            request_body = json.loads(request.body)
            otp = request_body.get("otp")
            secret = generate_otp_secret(username)
            if verify_OTP(secret, otp):
                return tokenize_login_response(username)
            else:
                return JsonResponse({"error": "Invalid OTP"}, status=401)
        except Exception as e:
            return JsonResponse({"error": "Invalid Authorization token"}, status=401)
    return JsonResponse({'error': "Method not allowed"}, status=405)
    
@csrf_exempt
def set_double_factor_auth(request):
    if request.method == "POST":
        try:
            decoded_payload = validate_jwt(request)
            user_id = decoded_payload.get('id')
            user = User.objects.get(id=user_id)
            user_2fa = User_2fa.objects.get(user=user)
            request_body = json.loads(request.body)
            # if request_body['enable2fa'] == "true" and user_2fa.enabled_2fa == True:
            #     return JsonResponse({"message": "2FA already enabled!"}, status=208)
            #     # user_2fa.enabled_2fa = True
            #     # user_2fa.two_factor_secret = generate_otp_secret(user.username)
            #     # user_2fa.save()
            #     # return JsonResponse({"secret": user_2fa.two_factor_secret, "id": user_id})
            if request_body['enable2fa'] == "false":
                user_2fa.enabled_2fa = False
                user_2fa.two_factor_secret = ""
                user_2fa.save()
                return JsonResponse({"message": "user disabled ", "id": user_id})
            else:
               return JsonResponse({"error": "couldn't set 2fa"}, status=500)
        except Exception as e:
            return JsonResponse({"error": f"Invalid or missing Authorization header, got exception {e}"}, status=401)
    return JsonResponse({'error': "Method not allowed"}, status=405)

@csrf_exempt
def redirect_uri(request):
	if request.method == "POST":
		client_id = os.environ.get("INTRA_CLIENT_ID", "")
		if (len(client_id) == 0):
			intra_link = "#"
		else:
			intra_link="https://api.intra.42.fr/oauth/authorize?client_id={}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code"\
				.format(client_id)
		return JsonResponse({"oauth_link": intra_link})
	return JsonResponse({'error': "Method not allowed"}, status=405)


@csrf_exempt
def submit_2fa_email(request):
    if request.method == "POST":
        try:
            decoded_payload = validate_jwt(request)
            user_id = decoded_payload.get('id')
            user = User.objects.get(id=user_id)
            user_2fa = User_2fa.objects.get(user=user)
            request_body = json.loads(request.body)
            
            if user_2fa.enabled_2fa:
                return JsonResponse({'error': "Double factor authentication already enabled"}, status=408)
            if not_valid_email(request_body):
                return JsonResponse({'error': "bad request body"}, status=400)
            user_2fa.two_factor_secret = generate_otp_secret(user.username)
            user_2fa.save()
            response  = send_otp_email(request_body["email"], generate_otp(user_2fa.two_factor_secret))
            if (response.status_code != 202):
                return JsonResponse({'error': "Email sending failed"}, status=response.status_code)
            user.email = request_body["email"]
            user.save()
            print(f"{user.email} saved to {user.username}")
            return JsonResponse({'message': "One time password sent to your email"}, status=response.status_code)
        except Exception as e:
            print(e)
            return JsonResponse({'error': "Unauthorized acces"}, status=401)
    return JsonResponse({'error': "Method not allowed"}, status=405)

@csrf_exempt
def enable_2fa_email(request):
    if request.method != "POST":
        return JsonResponse({'error': "Method not allowed"}, status=405)
    try:
        decoded_payload = validate_jwt(request)
        user_id = decoded_payload.get('id')
        user = User.objects.get(id=user_id)
        user_2fa = User_2fa.objects.get(user=user)    
        request_body = json.loads(request.body)
        if not request_body or "otp" not in request_body \
            or "email" not in request_body or len(request_body) != 2:
            return JsonResponse({'error': "bad request body"}, status=400)
        if not verify_OTP(user_2fa.two_factor_secret, request_body["otp"]):
            return JsonResponse({"error": "failed to enable 2FA  invalid otp"}, status=401)
        elif request_body["email"] != user.email:
            return JsonResponse({"error": "failed to enable 2FA wrong email sent"}, status=401)
        user_2fa.enabled_2fa = True
        user_2fa.save()
        return JsonResponse({"message": "2FA enabled!"})

    except Exception as e:
        print(e)
        return JsonResponse({"error": "Invalid authorization token"}, status=401)
    #extract email and secret
    #verify email and enable 2fa if correct otherwise send error code
    return JsonResponse({"error": "failed to enable 2FA"}, status=401)

@csrf_exempt
def test_send_otp(request):
    if request.method == "GET":
        try:
            send_otp_email("pong@null.bet", "000000 this is a test 0top")
            # send_smtp_email()
        except Exception as e:
            return JsonResponse({"error": f"{e}"}, status=401)
        # send_otp_email("pong@null.net", "<test for sending emails 0000>")
        return JsonResponse({"message": "Test email sent"})
    return JsonResponse({'error': "Method not allowed"}, status=405)