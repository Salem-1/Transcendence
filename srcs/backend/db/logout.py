import hashlib
import os
import base64
import secrets
import random
import string
from .get_secret import get_secret



def generate_encrypted_secret(length=13):
   return (encrypt_string(generate_password(length)))

# def generate_keyed_hash(password, key):
#   hashed_data = hashlib.sha3_512(password.encode() + key.encode() + get_secret("SALT")).hexdigest()
#   return get_secret("SALT") + hashed_data.encode() 

def encrypt_string(secret):
    encoded_bytes = base64.b85encode(secret.encode("utf-8"))
    encoded_str = encoded_bytes.decode("utf-8") 
    return encoded_str

def decrypt_string(encrypted_string):
  encoded_bytes = encrypted_string.encode("utf-8")
  secret_bytes = base64.b85decode(encoded_bytes)
  secret = secret_bytes.decode("utf-8")
  return secret

def generate_password(length=13):
  chars = string.ascii_letters + string.digits + string.punctuation
  result = ""
  for i in range(length):
     result += chars[random.randint(0, len(chars) - 1)]
  return result

def decode_base64url(data):
    padding_needed = len(data) % 4
    if padding_needed:  # pad with '='
        data += '=' * (4 - padding_needed)
    data = data.replace('-', '+').replace('_', '/')
    decoded_data = base64.b64decode(data)
    try:
        return decoded_data.decode('utf-8')
    except UnicodeDecodeError:
        return decoded_data
