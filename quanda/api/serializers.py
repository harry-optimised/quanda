import logging
from rest_framework import serializers
from item.models import Evidence, Item, System, Tag, ItemRelation, Project

logger = logging.getLogger(__name__)

class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = System
        fields = '__all__'

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class LightItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'primary', 'secondary', 'tags', 'system', 'frozen', 'priority', 'confidence']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class LinkSerializer(serializers.ModelSerializer):
    target = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    
    class Meta:
        model = ItemRelation
        fields = ['target', 'type']

    def get_target(self, obj):
        direction = self.context.get('direction')
        if direction == 'forward':
            return LightItemSerializer(obj.to_item).data
        elif direction == 'backward':
            return LightItemSerializer(obj.from_item).data
        
    def get_type(self, obj):
        direction = self.context.get('direction')
        if direction == 'forward' and obj.relation_type == 'relates_to':
            return 'relates_to'
        elif direction == 'forward' and obj.relation_type == 'supports':
            return 'supports'
        elif direction == 'backward' and obj.relation_type == 'relates_to':
            return 'relates_to'
        elif direction == 'backward' and obj.relation_type == 'supports':
            return 'supported_by'


class ItemSerializer(serializers.ModelSerializer):
    links = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = '__all__'

    def get_links(self, obj):
        links = []
        for link in obj.from_items.all():
            links.append(LinkSerializer(link, context={'direction': 'forward'}).data)
        for link in obj.to_items.all():
            links.append(LinkSerializer(link, context={'direction': 'backward'}).data)
        return links

class AddLinkSerializer(serializers.Serializer):
    to_item = serializers.IntegerField(required=True)
    relation_type = serializers.ChoiceField(choices=['supports', 'relates_to'], required=True)