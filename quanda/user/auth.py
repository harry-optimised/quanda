from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth import get_user_model
from guardian.shortcuts import assign_perm
from item.models import Project
import requests

# TODO: Need to support logout on the frontend.
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

            user_info = requests.get(
                'https://dev-czejtnrwqf2cuw1e.uk.auth0.com/userinfo', 
                headers={'Authorization': header}
            ).json()

            email = user_info.get('email', None)

            if email:
                user.username = email
                user.save()

            project = Project.objects.create(
                name='Sandbox',
                description='Sandbox environment.'
            )

            assign_perm('change_project', user, project)


        return (user, validated_token)
