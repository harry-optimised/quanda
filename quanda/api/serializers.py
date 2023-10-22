import logging
from rest_framework import serializers
from item.models import Evidence, Item, System, Tag, ItemRelation

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

class ForwardLinkSerializer(serializers.ModelSerializer):
    target = serializers.SerializerMethodField()  
    relation = serializers.SerializerMethodField()
    primary = serializers.SerializerMethodField()
    secondary = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = ItemRelation
        fields = ['target','relation', 'primary', 'secondary', 'tags']

    def get_target(self, obj):
        return obj.to_item.id if obj.to_item else None

    def get_relation(self, obj):
        if obj.relation_type == 'relates_to':
            return 'relates_to'
        elif obj.relation_type == 'supports':
            return 'supports'
    
    def get_primary(self, obj):
        return obj.to_item.primary if obj.to_item else None
    
    def get_secondary(self, obj):
        return obj.to_item.secondary if obj.to_item else None
      
    def get_tags(self, obj):
        return [tag.id for tag in obj.to_item.tags.all()]

class BackwardLinkSerializer(serializers.ModelSerializer):
    target = serializers.SerializerMethodField()   
    relation = serializers.SerializerMethodField()
    primary = serializers.SerializerMethodField()
    secondary = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = ItemRelation
        fields = ['target', 'relation', 'primary', 'secondary', 'tags']

    def get_target(self, obj):
        return obj.from_item.id if obj.from_item else None
    
    def get_relation(self, obj):
        if obj.relation_type == 'relates_to':
            return 'relates_to'
        elif obj.relation_type == 'supports':
            return 'supported_by'
    
    def get_primary(self, obj):
        return obj.from_item.primary if obj.from_item else None
    
    def get_secondary(self, obj):
        return obj.from_item.secondary if obj.from_item else None
      
    def get_tags(self, obj):
        return [tag.id for tag in obj.from_item.tags.all()]
    


class ItemSerializer(serializers.ModelSerializer):
    links = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = '__all__'

    def get_links(self, obj):
        links = []
        for link in obj.from_items.all():
            links.append(ForwardLinkSerializer(link).data)
        for link in obj.to_items.all():
            links.append(BackwardLinkSerializer(link).data)
        return links



class AddLinkSerializer(serializers.Serializer):
    to_item = serializers.IntegerField(required=True)
    relation_type = serializers.ChoiceField(choices=['supported', 'relates_to'], required=True)