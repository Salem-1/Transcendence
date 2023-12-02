import pyotp
import time
import base64
import os
import jwt
import json
from django.http import HttpResponse
import datetime

def verify_OTP(secret, given_otp):
    totp = pyotp.TOTP(secret)
    return totp.verify(given_otp)

def fetch_otp_secret(username):
    return (base64.b32encode(username.encode('utf-8')).decode('utf-8'))

def is_2fa_enabled(user):
    return  user.enabled_2fa

def authenticate_otp_redirect(username):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=1)
    exp_unix_timestamp = int(expiration_time.timestamp())
    encoded_jwt = jwt.encode({
        "username": username,
        "type": "otp",
        "exp": exp_unix_timestamp  
    }, os.environ['secret_pass'], algorithm="HS256")
    encoded_jwt = encoded_jwt.decode('utf-8')  
    response_data = {
        'jwt_token': encoded_jwt,
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