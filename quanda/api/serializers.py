from rest_framework import serializers
from tasks.models import Task, Github
import json


class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def validate_commit(self, value):
        """Ensure the commit exists in the repository."""

        repository = self.initial_data.get('repository')
        if not Github.check_commit(repository, value):
            raise serializers.ValidationError("Commit does not exist in repository.")
        
        return value

class TaskDetailSerializer(TaskListSerializer):
    
    class Meta:
        model = Task
        fields = '__all__'
        
class CombinedTaskSerializer(serializers.Serializer):
    primary_task = TaskDetailSerializer(source='*') 
    secondary_tasks = TaskDetailSerializer(many=True, source='get_associated_tasks')


class GithubRepositoriesSerializer(serializers.Serializer):
    
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=100)
    description = serializers.CharField()

    class Meta:
        fields = ['id', 'name', 'description']



class AWSECRSerializer(serializers.Serializer):

    repositoryName = serializers.CharField()

    class Meta:
        fields = ['repositoryName']