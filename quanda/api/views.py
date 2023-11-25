from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination


from item.models import Evidence, Item, System, Tag, ItemRelation
from api.serializers import SystemSerializer, EvidenceSerializer, TagSerializer, ItemSerializer, AddLinkSerializer

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 12

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
    queryset = Item.objects.all().order_by('primary')
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['primary']
    pagination_class = CustomPageNumberPagination

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

        relation = ItemRelation.objects.create(
            from_item=item,
            to_item=to_item,
            relation_type=link_serializer.validated_data['relation_type']
        )

        return Response(status=status.HTTP_201_CREATED)
