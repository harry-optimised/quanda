from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from tasks.models import Task, Github, AWS
from api.serializers import (
    TaskListSerializer, 
    CombinedTaskSerializer, 
    GithubRepositoriesSerializer, 
    AWSECRSerializer
)

class TaskViewSet(viewsets.ModelViewSet):

    queryset = Task.objects.all()
    
    def get_serializer_class(self):

        if self.action == 'retrieve':
            return CombinedTaskSerializer
        
        return TaskListSerializer
 
    def perform_create(self, serializer):

        serializer.save(user=self.request.user)


class GithubRepositoryView(APIView):
    
    serializer_class = GithubRepositoriesSerializer

    def get(self, request, *args, **kwargs):

        repositories = Github.get_repositories()
        serializer = self.serializer_class(repositories, many=True)
        return Response(serializer.data)
    

class AWSECRView(APIView):

    serializer_class = AWSECRSerializer

    def get(self, request, *args, **kwargs):
            
            repositories = AWS.get_repositories()
            serializer = self.serializer_class(repositories, many=True)
            return Response(serializer.data)