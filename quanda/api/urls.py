from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register(r'systems', views.SystemViewSet)
router.register(r'evidences', views.EvidenceViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'items', views.ItemViewSet)
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
