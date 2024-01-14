import pyotp
import time
import base64
import os
import jwt
import json
from django.http import HttpResponse
import datetime
from .authintication_utils import gen_jwt_token
from .models import User_2fa

def verify_OTP(secret, given_otp):
    totp = pyotp.TOTP(secret)
    return totp.verify(given_otp)

def generate_otp(secret):
    totp = pyotp.TOTP(secret)
    return totp.now()

def generate_otp_secret(username):
    return (base64.b32encode(username.encode('utf-8')).decode('utf-8'))

def is_2fa_enabled(user):
    if not User_2fa.objects.filter(user=user).exists():
          User_2fa.objects.create(user=user, enabled_2fa=False)
    return User_2fa.objects.get(user=user).enabled_2fa

def authenticate_otp_redirect(username):
    otp_jwt = gen_jwt_token(username, "otp", 1)
    response_data = {
        'jwt_token': otp_jwt,
        'username': username,
        'type': "otp"
        }
    json_response = json.dumps(response_data)
    return HttpResponse(
                json_response,
                status=302,
                content_type="application/json"
                )


# import pyotp

# hotp = pyotp.HOTP('base32secret3232')
# hotp.at(0) # => '260182'
# hotp.at(1) # => '055283'
# hotp.at(1401) # => '316439'

# # OTP verified with a counter
# hotp.verify('316439', 1401) # => True
# hotp.verify('316439', 1402) # => False
#enabled_2fa | two_factor_secret































