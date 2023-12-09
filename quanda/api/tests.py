from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase

class UserTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path('api/', include('api.urls')),
    ]

    # https://www.django-rest-framework.org/api-guide/testing/#example_1
