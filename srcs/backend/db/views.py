from django.shortcuts import render
from django.contrib.auth.models import User
from .models import User_2fa
from django.contrib.auth import authenticate, login
from django.http  import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseNotFound
from .double_factor_authenticate import is_2fa_enabled, authenticate_otp_redirect, generate_otp_secret, verify_OTP,  generate_otp, handle_intra_otp
import json
import jwt
import pyotp
import os
from db.authintication_utils import fetch_auth_token, fetch_intra_user_data, login_intra_user, create_intra_user, is_valid_input, tokenize_login_response, validate_jwt
from .logout import encrypt_string, decrypt_string, generate_password, generate_encrypted_secret
from .send_otp import send_otp_email, not_valid_email, send_smtp_email
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from .responses import http_responses
from .fetch_user_data import fetch_user_data, create_new_user, get_registration_data
from .smart_contract import set_winner_on_smart_contract, get_all_winners
from .get_secret import get_secret
from .langs import isAcceptedLanguage

@csrf_exempt
def register_user(request):
    if request.method =='POST':
        try:
            language = (json.loads(request.body)).get('language') or 'en'
            if not isAcceptedLanguage(language):
                 language = 'en'
            valid_input , username, password, error_message = get_registration_data(request);
            if not valid_input:
                return error_message
            elif User.objects.filter(username=username).exists():
                return JsonResponse({'error': "Username already taken"}, status=401)
            create_new_user(username, password, language)
            return JsonResponse({'message': "Registration successful"})
        except Exception as e:
            print(e)
            return JsonResponse({'error': "Bad request"}, status=400)  
    return JsonResponse({'error': "Method not allowed"}, status=405)  

@csrf_exempt
def login_user(request):
    if request.method =='POST':
        try:
            valid_input , username, password, error_message = get_registration_data(request);
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
            print(f"{e}")
            return JsonResponse({"error": "Internal server error while login"}, status=500)  
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def resend_otp(request):
	if request.method == "GET":
		try:
			decoded_payload = validate_jwt(request)
			if decoded_payload.get('type') != 'otp':
				raise jwt.exceptions.InvalidTokenError()
			user, user_2fa, user_id =   fetch_user_data(decoded_payload)
			if user_2fa.enabled_2fa:
				send_otp_email(user.email, generate_otp(user_2fa.two_factor_secret))
				return JsonResponse({"message": "otp resent"})
			return JsonResponse({"error": "2fa not enabled"}, status=401)
		except Exception as e:
			return JsonResponse({"error": "Invalid Authorization token"}, status=401)
	return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def mfa_state(request):
	if request.method == "GET":
		try:
			decoded_payload = validate_jwt(request)
			user, user_2fa, user_id =   fetch_user_data(decoded_payload)
			if user_2fa.enabled_2fa:
				return JsonResponse({"mfa": "enabled"})
			return JsonResponse({"mfa": "disabled"})
		except Exception as e:
			return JsonResponse({"error": "Invalid Authorization token"}, status=401)
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
                        return handle_intra_otp(username)
                    return  tokenize_login_response(username)
                return JsonResponse({'error': "couldn't register or login!"}, status=400)
        except Exception as e:  
            return JsonResponse({'error': f"Internal server error couldn't login with intra {e}"}, status=500)
    print(e)
    return JsonResponse({'error': "Internal server error"}, status=500)

@csrf_exempt
def fetch_username(request):
    try:
        decoded_payload = validate_jwt(request)
        user, user_2fa, user_id =   fetch_user_data(decoded_payload)
        if decoded_payload['type'] != 'Bearer':
            raise jwt.exceptions.InvalidTokenError()
        fetched_username = user.username
        return JsonResponse({"username": fetched_username, "id": user_id})
    except Exception as e:
        return JsonResponse({"error": "Invalid Authorization token"}, status=401)

@csrf_exempt
def login_verf(request):
    if request.method == "GET":
        try:
            decoded_payload = validate_jwt(request)
            if decoded_payload['type'] != 'Bearer':
                raise jwt.exceptions.InvalidTokenError()
            return JsonResponse({"message": "valid token"})
        except Exception as e:
            return JsonResponse({"error": "Invalid Authorization token"}, status=401)
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def not_logged_in(request):
    if request.method == "GET":
        try:
            decoded_payload = validate_jwt(request)
            if decoded_payload['type'] != 'Bearer':
                raise jwt.exceptions.InvalidTokenError()
            return JsonResponse({"error": "valid token"}, status=401)
        except Exception as e:
            return JsonResponse({"message": "Not Logged In"})
    return JsonResponse({"error": "Method not allowed"}, status=405)


    

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
            user, user_2fa, user_id =   fetch_user_data(validate_jwt(request))
            request_body = json.loads(request.body)
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
        try:
            client_id = get_secret("INTRA_CLIENT_ID")
            if (len(client_id) == 0):
                intra_link = "#"
            else:
                intra_link="https://api.intra.42.fr/oauth/authorize?client_id={}&redirect_uri=https%3A%2F%2Flocalhost%3A443%2Fauth&response_type=code"\
                    .format(client_id)
            return JsonResponse({"oauth_link": intra_link})
        except Exception as e:
            print(e)
    return JsonResponse({'error': "Method not allowed"}, status=405)

@csrf_exempt
def logout_user(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        user, user_2fa, user_id =   fetch_user_data(validate_jwt(request))
        user_2fa.jwt_secret = generate_encrypted_secret(13)
        user_2fa.save()
        return JsonResponse({"message": "You are logged out!"})
    except Exception as e:
        return JsonResponse({"error": "Unauthorized logout request"}, status=401)



@csrf_exempt
def submit_2fa_email(request):
    if request.method == "POST":
        try:
            user, user_2fa, user_id =   fetch_user_data(validate_jwt(request))
            request_body = json.loads(request.body)
            if user_2fa.enabled_2fa:
                return JsonResponse({'error': "Double factor authentication already enabled"}, status=409)
            if not_valid_email(request_body):
                return JsonResponse({'error': "bad request body"}, status=400)
            user_2fa.two_factor_secret = generate_otp_secret(user.username)
            user_2fa.save()
            response  = send_otp_email(request_body["email"], generate_otp(user_2fa.two_factor_secret))
            if (response.status_code != 202):
                return JsonResponse({'error': "Email sending failed"}, status=response.status_code)
            user.email = request_body["email"]
            user.save()
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
        user, user_2fa, user_id =   fetch_user_data(validate_jwt(request))
        request_body = json.loads(request.body)
        if not request_body or "otp" not in request_body \
            or "email" not in request_body or len(request_body) != 2 \
                or len(request_body["otp"]) > 6:
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
    return JsonResponse({"error": "failed to enable 2FA"}, status=401)

@csrf_exempt
def test_send_otp(request):
    if request.method == "GET":
        try:
            send_otp_email("pong@null.net", "000000 this is a test otp")
        except Exception as e:
            return JsonResponse({"error": f"{e}"}, status=401)
        return JsonResponse({"message": "Test email sent"})
    return JsonResponse({'error': "Method not allowed"}, status=405)

@csrf_exempt
def error_code(request, exception=None):
    try:
        status = request.headers.get("X-Trans42-code")
        if (request.method == "GET" and status and status.isdigit()):
            num = int(status)	
            if (num > 100 and num < 600 and num != 404):
                if (http_responses.get(num)):
                    return HttpResponse(f'<html><body><h1>{http_responses.get(num)}</h1><body></html>', status = num)
                return HttpResponse("<html><body><h1>Unknown Status Code</h1><body></html>", status = request.headers.get("X-Trans42-code"))
        return HttpResponseNotFound("<html><body><h1>Not Found</h1><p>The requested resource was not found on this server.</p></body></html>")
    except Exception as e:
        print(e)
    return JsonResponse({'error': "bad request"}, status=400)


@csrf_exempt
def go_to_frontend(request):
    if (request.method == "GET"):
        return redirect("https://localhost:443", permanent=True)
    return HttpResponse("Method not allowed", status=405)



@csrf_exempt
def set_winner(request):
    if request.method != "POST":
        return HttpResponse("Method not allowed", status=405)
    try:
        jwt_payload = validate_jwt(request)
        user, user_2fa, user_id =   fetch_user_data(jwt_payload)
        request_body = json.loads(request.body)
        if set_winner_on_smart_contract(request_body, user.username):
            return JsonResponse({'message': "successful stored on blockchain"})
    except Exception as e:
        print(e)
        return JsonResponse({'error': "Failed to set winner"}, status=401)

    return JsonResponse({'error': "Failed to set winner"})

@csrf_exempt
def get_winners(request):
    if request.method != "GET":
        return HttpResponse("Method not allowed", status=405)
    try:
        jwt_payload = validate_jwt(request)
        user, user_2fa, user_id =   fetch_user_data(jwt_payload)
        winners = get_all_winners()
        return JsonResponse({'winners': winners})
    except Exception as e:
        print(e)
        return JsonResponse({'error': "Failed to get winner"}, status=401)

    return JsonResponse({'error': "Failed to get winner"})

@csrf_exempt
def set_languagePreference(request):
	if request.method != "POST":
		return JsonResponse({'error': "Method not allowed"}, status=405)
	try:
		jwt_payload = validate_jwt(request)
		user, user_2fa, user_id =   fetch_user_data(jwt_payload)
		request_body = json.loads(request.body)
		if "language" not in request_body or isAcceptedLanguage(request_body["language"]) == False:
			return JsonResponse({'error': "bad request"}, status=400)
		user_2fa.language = request_body["language"]
		user_2fa.save()
		return JsonResponse({'message': "language preference set"})
	except Exception as e:
		print(e)
		return JsonResponse({'error': "Failed to set language preference"}, status=401)

	return JsonResponse({'error': "Failed to set language preference"})

@csrf_exempt
def get_languagePreference(request):
	if request.method != "GET":
		return JsonResponse({'error': "Method not allowed"}, status=405)
	try:
		jwt_payload = validate_jwt(request)
		user, user_2fa, user_id =   fetch_user_data(jwt_payload)
		return JsonResponse({'language': user_2fa.language})
	except Exception as e:
		print(e)
		return JsonResponse({'error': "Failed to get language preference"}, status=401)

	return JsonResponse({'error': "Failed to get language preference"})


@csrf_exempt
def say_hello(request):
    return JsonResponse({'Message': "Hello ya Asta"})

