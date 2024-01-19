import hashlib
import os

def generate_keyed_hash(password, key):
  hashed_data = hashlib.sha3_512(password.encode() + key.encode() + os.environ.get("SALT")).hexdigest()
  return os.environ.get("SALT") + hashed_data.encode() 
