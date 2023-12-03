from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth import get_user_model

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
        # TODO: Use 'created' to populate user information and perform setup.
        
        return (user, validated_token)