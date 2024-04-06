import logging
from guardian.shortcuts import get_objects_for_user
from rest_framework.exceptions import ValidationError
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

    def validate(self, attrs):
        entry_date = attrs.get('date')
        user = self.context['request'].user

        # Use Django Guardian's get_objects_for_user to check if the user has permissions for any entries on the given date
        existing_entries = get_objects_for_user(user, 'view_entry', klass=Entry).filter(date=entry_date)
        if existing_entries.exists():
            raise ValidationError({'date': 'An entry for this date already exists for you.'})

        return attrs