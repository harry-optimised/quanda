from logging import getLogger

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from guardian.shortcuts import assign_perm, get_objects_for_user
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

    def get_queryset(self):
        return get_objects_for_user(self.request.user, 'view_tag', klass=Tag)

    def perform_create(self, serializer):
        tag = serializer.save()
        assign_perm('view_tag', self.request.user, tag)


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = get_objects_for_user(self.request.user, 'view_entry', klass=Entry)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.annotate(
                search=SearchVector('thought__content'),
            ).filter(search=search_query)
        return queryset

    def paginate_queryset(self, queryset):
        if self.action == 'list':
            print(queryset.values())
            return super().paginate_queryset(queryset)
        return None

    def perform_create(self, serializer):
        entry = serializer.save()
        assign_perm('view_entry', self.request.user, entry)

    @action(detail=True, methods=['post'], url_path='add-thought')
    def add_thought(self, request, pk=None):
        entry = self.get_object()

        if not request.user.has_perm('view_entry', entry):
            return Response(status=status.HTTP_403_FORBIDDEN)

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

        if not request.user.has_perm('view_entry', entry):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
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

        if not request.user.has_perm('view_entry', entry):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        thought = get_object_or_404(Thought, id=thought_id, entry=entry)
        thought.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
