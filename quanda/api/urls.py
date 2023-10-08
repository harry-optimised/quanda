from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TaskViewSet, GithubRepositoryView, AWSECRView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('repositories/', GithubRepositoryView.as_view(), name='repositories'),
    path('ecr/', AWSECRView.as_view(), name='ecr')
]
