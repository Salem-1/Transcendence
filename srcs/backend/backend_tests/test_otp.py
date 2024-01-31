import pyotp
import base64

secret = ""
# MFZWIZTKNNRGEZDTGQ2DKRQ=
# Encode the secret in base32
secret_base32 = base64.b32encode(secret.encode('utf-8')).decode('utf-8')
 
totp = pyotp.TOTP(secret_base32)
print(f"secret is {secret_base32}")
print(f"pyotp.parse_uri('otpauth://hotp/Secure%20App:alice%40google.com?secret={secret_base32}&issuer=Secure%20App&counter=0'")
print(f"pyotp.parse_uri('otpauth://totp/Secure%20App:alice%40google.com?secret={secret_base32}&issuer=Secure%20App')'")
print(totp.now())  # This should work nowahmad_mohsen