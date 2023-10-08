from rest_framework import serializers
from tasks.models import Task
import json


class InputsSerializer(serializers.Serializer):

    task_id = serializers.IntegerField()
    type = serializers.ChoiceField(choices=['file', 'parameter'])
    key = serializers.CharField()
    value = serializers.CharField()


class OutputsSerializer(serializers.Serializer):

    regex = serializers.CharField()
    key = serializers.CharField()
    value = serializers.CharField()