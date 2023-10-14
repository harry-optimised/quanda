from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from item.models import Evidence, Item, System, Tag
from api.serializers import SystemSerializer, EvidenceSerializer, TagSerializer, ItemSerializer

class SystemViewSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer