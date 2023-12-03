from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated


from item.models import Evidence, Item, System, Tag, ItemRelation, Project
from api.serializers import SystemSerializer, EvidenceSerializer, TagSerializer, ItemSerializer, AddLinkSerializer, ProjectSerializer

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 12

class SystemViewSet(viewsets.ModelViewSet):
    queryset = System.objects.all()
    serializer_class = SystemSerializer
    permission_classes = [IsAuthenticated]

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('primary')
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['primary']
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAuthenticated]

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