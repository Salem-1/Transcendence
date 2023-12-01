import pyotp
import time
import base64
import os
import jwt
import json
from django.http import HttpResponse

def verify_OTP(secret, given_otp):
    totp = pyotp.TOTP(secret)
    return totp.verify(given_otp)

def fetch_otp_secret(username):
    return (base64.b64encode(username))
# def generate_OTP_secret(username):
#    return  base64.standard_b64encode(username)
    
# def enabled_2fa(username):
#    return  True

def is_2fa_enabled(username):
    return True

def authenticate_otp_page(username):
    encoded_jwt = jwt.encode({
                                "username": username,
                                "type": "otp",
                                "expiary" : "2mins"
                            }, os.environ['secret_pass'], algorithm="HS256")
    encoded_jwt = encoded_jwt.decode('utf-8')  
    response_data = {
        'otp_token': encoded_jwt,
        'username': username,
        'otp': "true"
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