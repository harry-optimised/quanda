from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register(r'tags', views.TagViewSet)
router.register(r'thoughts', views.ThoughtViewSet, basename='thought')
router.register(r'entries', views.EntryViewSet, basename='entry')

urlpatterns = [
    path('', include(router.urls)),
]
