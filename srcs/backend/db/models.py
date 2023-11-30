from django.db import models
from django.contrib.auth.models import User

def get_user_id(username):
    try:
        user = User.objects.get(username=username)
        user_id = user.id
        return user_id
    except User.DoesNotExist:
        return None