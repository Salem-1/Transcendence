from django.db import models
from django.contrib.auth.models import User

class User_2fa(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    two_factor_secret = models.CharField(max_length=150, null=True, blank=True)
    enabled_2fa = models.BooleanField(default=False)
    jwt_secret = models.CharField(max_length=150, null=True, blank=True)
    def __str__(self):
        return self.user.username
