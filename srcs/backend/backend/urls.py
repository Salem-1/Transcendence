"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from db.views import register_user, login_user, auth_intra, fetch_username, double_factor_auth, set_double_factor_auth

from db.views import login_verf, redirect_uri, not_logged_in, logout_user, submit_2fa_email, enable_2fa_email, test_send_otp, error_code, go_to_frontend,set_winner, get_winners
from db.views import mfa_state

handler404 = error_code

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register_user, name="register_user"),
    path('login/', login_user, name="login_user"),
    path('logout/', logout_user, name="logout_user"),
    path('auth/', auth_intra, name="auth_intra"),
    path('username/', fetch_username, name="fetch_username"),
    path('double_factor_auth/', double_factor_auth, name="double_factor_auth"),
    path('set_2fa/', set_double_factor_auth, name="set_double_factor_auth"),
	path('api/loginVerfication/', login_verf, name='loginVerfication'),
	path('redirect_uri/', redirect_uri, name='redirect_uri'),
	path('api/notLoggedIn/', not_logged_in, name='notLoggedIn'),
	path('submit_2fa_email/', submit_2fa_email, name='submit_2fa_email'),
	path('enable_2fa_email/', enable_2fa_email, name='enable_2fa_email'),
	path('test_send_otp/', test_send_otp, name='test_send_otp'),
	path('set_winner/', set_winner, name='set_winner'),
	path('get_winners/', get_winners, name='get_winners'),
	path('',go_to_frontend, name='go_to_frontend'),
	path('api/mfaState/', mfa_state, name='mfa_state'),
]
