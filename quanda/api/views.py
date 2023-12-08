from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from guardian.shortcuts import get_objects_for_user

from item.models import Item, Tag, ItemRelation, Project
from api.serializers import TagSerializer, ItemSerializer, AddLinkSerializer, ProjectSerializer

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 12


class HasAccessToProject(BasePermission):
    def has_permission(self, request, view):
         
        project = request.headers.get('Quanda-Project', None)
        return project and request.user.has_perm('change_project', Project.objects.get(pk=project))
          

class FilterByProjectMixin():

    def get_queryset(self):
        """Filter items by the requested project."""

        project = self.request.headers.get('Quanda-Project')
        queryset = super().get_queryset()
        return queryset.filter(project__pk=project).order_by('-created_at')


class TagViewSet(FilterByProjectMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated, HasAccessToProject]
    pagination_class = CustomPageNumberPagination

    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None


class ItemViewSet(FilterByProjectMixin, viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['primary']
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated, HasAccessToProject]

   
    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None
    
    @action(detail=True, methods=['POST'])
    def add_link(self, request, pk=None):
        item = self.get_object()
        link_serializer = AddLinkSerializer(data=request.data)
        link_serializer.is_valid(raise_exception=True)

        try:
            to_item = Item.objects.get(pk=link_serializer.validated_data['to_item'])
        except Item.DoesNotExist:
            return Response({'error': 'Item to link to does not exist'}, status=status.HTTP_404_NOT_FOUND)

        ItemRelation.objects.create(
            from_item=item,
            to_item=to_item,
            relation_type=link_serializer.validated_data['relation_type']
        )
        
        return Response(ItemSerializer(to_item).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['POST'])
    def remove_link(self, request, pk=None):
        item = self.get_object()
        link_serializer = AddLinkSerializer(data=request.data)
        link_serializer.is_valid(raise_exception=True)

        try:
            to_item = Item.objects.get(pk=link_serializer.validated_data['to_item'])
        except Item.DoesNotExist:
            return Response({'error': 'Item to link to does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            relations = ItemRelation.objects.filter(
                from_item=item,
                to_item=to_item,
                relation_type=link_serializer.validated_data['relation_type']
            )
        except ItemRelation.DoesNotExist:
            return Response({'error': 'Link does not exist'}, status=status.HTTP_404_NOT_FOUND)

        for relation in relations:
            relation.delete()
        
        return Response(ItemSerializer(to_item).data, status=status.HTTP_200_OK)
    


class ProjectViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin, viewsets.mixins.CreateModelMixin):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def paginate_queryset(self, queryset):
        if self.action == 'list':
            return super().paginate_queryset(queryset)
        return None
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return get_objects_for_user(self.request.user, 'change_project', queryset).order_by('-created_at')
    
    def perform_create(self, serializer):
        project = serializer.save()
        self.request.user.user_permissions.add('change_project', project)
        self.request.user.save()