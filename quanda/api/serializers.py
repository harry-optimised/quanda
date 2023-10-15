from rest_framework import serializers
from item.models import Evidence, Item, System, Tag


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

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'