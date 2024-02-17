from .models import User_2fa

def isAcceptedLanguage(language):
	accepted_languages = ['en', 'es', 'pt', 'ar']  # Add more languages in this area
	if language not in accepted_languages:
		return False
	return True

def set_languagePreference(user, language):
	user_2fa = User_2fa.objects.get(user=user)
	user_2fa.language = language
	user_2fa.save()
	return True