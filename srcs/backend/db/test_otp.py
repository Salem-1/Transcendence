import pyotp
import time
import base64

secret = "werty23FG"
secret = base64.b64encode(secret.encode('utf-8'))
totp = pyotp.TOTP('base32secret3232')
print(totp.now()) # => '492039'
