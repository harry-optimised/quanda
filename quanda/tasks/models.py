from django.db import models
from uuid import uuid4
import random
import requests
import logging
import boto3
from typing import Any
from functools import lru_cache
from django.conf import settings
from django.core.cache import cache
from django.contrib.auth import get_user_model

logger = logging.getLogger('quanda')

class Task(models.Model):

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='tasks')

    repository = models.CharField(max_length=255, default='marla')
    commit = models.CharField(max_length=255, default='0bc33b41550102f7e8a3d5b9b99c11d352b7f629')
    script = models.CharField(default='')

    docker_image = models.CharField(max_length=255, default='devopsjane/nginx-optimized:1.2.3')
    inputs = models.JSONField(default=list, blank=False)
    outputs = models.JSONField(max_length=255, default=list, blank=False)

    def get_associated_tasks(self):
        task_inputs = [i for i in self.inputs if i['type'] == 'file']
        associated_task_ids = set([t['task_id'] for t in task_inputs])
        return Task.objects.filter(id__in=associated_task_ids)

    def __str__(self):
        return self.name
    

class Run(models.Model):
    
    class Status(models.TextChoices):
        SUCCEEDED = 'succeeded'
        FAILED = 'failed'
        RUNNING = 'running'
        QUEUED = 'queued'
        DRAFT = 'draft'

    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='runs')
    status = models.CharField(max_length=255, choices=Status.choices, default=Status.DRAFT)

    def __str__(self):
        return self.status 
    

class Tag(models.Model):

    def generate_random_color():
        return "#{:06x}".format(random.randint(0, 0xFFFFFF))

    name = models.CharField(max_length=255)
    colour = models.CharField(max_length=255, default=generate_random_color)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='tags')

    def __str__(self):
        return self.name


# External Datastores
#####################

# TODO: Handle these edge caes:
#  - Missing PAT token.
#  - Missing user.
#  - Invalid PAT token.
#  - Invalid user.
#  - No repositories.
#  - API call not successful.
#  - Pagination of results.

class Github:

    

    headers = {
        "Authorization": f"token {settings.GITHUB_PAT}",
        "Accept": "application/vnd.github.v3+json", 
    }

    repositories_url = f"{settings.GITHUB_BASE_URL}/users/{settings.GITHUB_USER}/repos?per_page=100"
    commit_url = f"{settings.GITHUB_BASE_URL}/repos/{settings.GITHUB_USER}/"
    
    @classmethod
    def get_repositories(cls):
        """Fetch all repositories for a given user."""            
        
        cached_data = cache.get('github_repositories')

        if cached_data:
            return cached_data

        response = requests.get(cls.repositories_url, headers=cls.headers)

        if response.status_code != 200:
            error_message = f"Error fetching repositories: {response.text}"
            logger.error(error_message)
            raise Exception(error_message)
        
        cache.set('github_repositories', response.json(), timeout=60*60)
        return response.json()
    
    @classmethod
    def check_commit(cls, repository_name, commit_id):
        """Check whether a commit exists in a given repository."""

        cached_data = cache.get(f'github_commit_{repository_name}_{commit_id}')

        if cached_data:
            return cached_data

        response = requests.get(f"{cls.commit_url}{repository_name}/commits/{commit_id}", headers=cls.headers)

        if response.status_code == 200:
            cache.set(f'github_commit_{repository_name}_{commit_id}', True, timeout=60*60)
            return True
        else:
            cache.set(f'github_commit_{repository_name}_{commit_id}', False, timeout=60*60)
            return False


class AWS:

    @classmethod
    @lru_cache(maxsize=1)
    def ecr_client(cls):
        """Get an ECR client using boto3."""

        print()
        
        return boto3.client(
            'ecr',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
    
    @classmethod
    def get_repositories(cls):
        """Fetch all ECR repositories."""
        
        cached_data = cache.get('aws_ecr_repositories')

        if cached_data:
            return cached_data            
          
        try:
            response = cls.ecr_client().describe_repositories()
            repositories = response.get('repositories', [])            
            cache.set('aws_ecr_repositories', repositories, timeout=60*60)
            return repositories
        
        except Exception as e:
            error_message = f"Error fetching ECR repositories: {str(e)}"
            logger.error(error_message)
            raise Exception(error_message)

