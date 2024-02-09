from django.contrib.auth.models import User
from .models import User_2fa
from .logout import generate_encrypted_secret
import json
from .authintication_utils import is_valid_input


def fetch_user_data(decoded_payload):
    user_id = decoded_payload.get('id')
    user = User.objects.get(id=user_id)
    user_2fa = User_2fa.objects.get(user=user)
    return user, user_2fa, user_id

def create_new_user(username, password):
    user = User.objects.create_user(username=username, password=password)
    user.save()
    user_2fa = User_2fa.objects.create(user=user)
    user_2fa.jwt_secret = generate_encrypted_secret(13)
    user_2fa.save()

def get_registration_data(request):
    data = json.loads(request.body)
    username  = data.get('username')
    password  = data.get('password')
    valid_input, error_message = is_valid_input(username, password, data);
    return valid_input , username, password, error_message
