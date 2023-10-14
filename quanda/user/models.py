from django.contrib.auth.models import AbstractUser, Group
from django.db import models

class User(AbstractUser):
   
    def __str__(self):
        return self.username
    
class Team(Group):
    # Add any extra fields or methods here if necessary
    pass