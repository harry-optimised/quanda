from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import authentication
from django.conf import settings
from django.contrib.auth import get_user_model
import requests


class Auth0Authentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        
        # TODO: Might be able to do this myself - much faster.
        jwt_authenticator = JWTAuthentication()
        header = jwt_authenticator.get_header(request)

        if header is None:
            return None
        
        raw_token = jwt_authenticator.get_raw_token(header)
        validated_token = jwt_authenticator.get_validated_token(raw_token)
        payload = validated_token.payload

        User = get_user_model()
        user, created = User.objects.get_or_create(sub=payload.get('sub'))

        if created:
            
            endpoint = settings.SIMPLE_JWT.get('USER_INFO_ENDPOINT', None)
            user_info = requests.get(endpoint, headers={'Authorization': header}).json()

            if email := user_info.get('email', None):
                user.username = email
                user.save()

        return (user, validated_token)
