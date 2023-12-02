import pyotp
import base64

secret = "ahsalem@student.42abudhabi.ae"

# Encode the secret in base32
secret_base32 = base64.b32encode(secret.encode('utf-8')).decode('utf-8')

totp = pyotp.TOTP(secret_base32)
print(f"secret is {secret_base32}")
print(totp.now())  # This should work now