from logging import getLogger

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.postgres.search import SearchVector
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from thought.models import Thought, Tag, Entry
from api.serializers import TagSerializer, ThoughtSerializer, EntrySerializer

logger = getLogger(__name__)

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 12


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None


class ThoughtViewSet(viewsets.ModelViewSet):
    queryset = Thought.objects.all()
    serializer_class = ThoughtSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['primary']
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]


    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                search=SearchVector('thought__content'),
            ).filter(search=search_query)
        return queryset

    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None
    
    @action(detail=True, methods=['post'], url_path='add-thought')
    def add_thought(self, request, pk=None):
        entry = self.get_object()
        thought_data = request.data
        thought_data['entry'] = entry.id
        serializer = ThoughtSerializer(data=thought_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='edit-thought/(?P<thought_id>[^/.]+)')
    def edit_thought(self, request, pk=None, thought_id=None):
        entry = self.get_object()
        thought = get_object_or_404(Thought, id=thought_id, entry=entry)
        request.data['entry'] = entry.id
        serializer = ThoughtSerializer(thought, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete-thought/(?P<thought_id>[^/.]+)')
    def delete_thought(self, request, pk=None, thought_id=None):
        entry = self.get_object()
        thought = get_object_or_404(Thought, id=thought_id, entry=entry)
        thought.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
