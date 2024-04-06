import logging
from rest_framework import serializers
from thought.models import Thought, Tag, Entry

logger = logging.getLogger(__name__)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ThoughtSerializer(serializers.ModelSerializer):
      class Meta:
        model = Thought
        fields = '__all__'


class EntrySerializer(serializers.ModelSerializer):
    thoughts = ThoughtSerializer(many=True, read_only=True, source='thought_set')

    class Meta:
        model = Entry
        fields = '__all__'