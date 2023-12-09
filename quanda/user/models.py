from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from item.models import Project, Item, Tag
from guardian.shortcuts import assign_perm, get_perms_for_model
from uuid import uuid4
from django.dispatch import receiver


class User(AbstractUser):
   
    sub = models.CharField(max_length=255, unique=True, default=uuid4)

    def __str__(self):
        return self.username
    
    def onboard(self):
        """Setup a basic set of objects for the user when they start."""

        project = Project.objects.create(name='Sandbox')
        tag = Tag.objects.create(name='example', project=project)
        assign_perm('change_project', self, project)

        item = Item.objects.create(primary='Welcome to Quanda', secondary="", confidence=0.5, project=project)
        item.tags.add(tag)
        item.save()


class Team(Group):
    # Add any extra fields or methods here if necessary
    pass


@receiver(models.signals.post_save, sender=User)
def onboard_user(sender, instance, created, **kwargs):
    """Call user onboard method after it's been created."""

    if created and instance.username != 'AnonymousUser':
        instance.onboard()