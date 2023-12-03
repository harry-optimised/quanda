from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from uuid import uuid4

class User(AbstractUser):
   
    sub = models.CharField(max_length=255, unique=True, default=str(uuid4()))

    def __str__(self):
        return self.username
    
class Team(Group):
    # Add any extra fields or methods here if necessary
    pass