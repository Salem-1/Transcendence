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
from db.views import mfa_state, say_hello, resend_otp, set_languagePreference, get_languagePreference

handler404 = error_code

urlpatterns = [
    # path('api/admin/', admin.site.urls),
    path('api/register/', register_user, name="register_user"),
    path('api/login/', login_user, name="login_user"),
    path('api/logout/', logout_user, name="logout_user"),
    path('api/auth/', auth_intra, name="auth_intra"),
    path('api/username/', fetch_username, name="fetch_username"),
    path('api/double_factor_auth/', double_factor_auth, name="double_factor_auth"),
    path('api/set_2fa/', set_double_factor_auth, name="set_double_factor_auth"),
	path('api/loginVerfication/', login_verf, name='loginVerfication'),
	path('api/redirect_uri/', redirect_uri, name='redirect_uri'),
	path('api/notLoggedIn/', not_logged_in, name='notLoggedIn'),
	path('api/submit_2fa_email/', submit_2fa_email, name='submit_2fa_email'),
	path('api/enable_2fa_email/', enable_2fa_email, name='enable_2fa_email'),
	path('api/test_send_otp/', test_send_otp, name='test_send_otp'),
	path('api/set_winner/', set_winner, name='set_winner'),
	path('api/get_winners/', get_winners, name='get_winners'),
	path('api/',go_to_frontend, name='go_to_frontend'),
	path('api/mfaState/', mfa_state, name='mfa_state'),
	path('api/resendOtp/', resend_otp, name='resend_otp'),
	path('api/setLanguagePreference/', set_languagePreference, name='set_languagePreference'),
	path('api/getLanguagePreference/', get_languagePreference, name='get_languagePreference'),
	path('api/hello/', say_hello, name='say_hello'),
]
