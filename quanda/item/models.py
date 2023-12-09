from django.db import models
from guardian.shortcuts import get_perms
    
class Project(models.Model):
    """Project Model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class ProjectMixin(models.Model):
    """Mixin to add a Project relationship."""
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, db_index=True)

    class Meta:
        abstract = True

    def can_be_accessed_by(self, user):
        return 'change_project' in get_perms(user, self.project)


class Evidence(ProjectMixin, models.Model):
    """Evidence Model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    description = models.TextField()
    link = models.URLField()

    def __str__(self):
        return self.name
    

class Tag(ProjectMixin, models.Model):
    """Tag Model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    description = models.TextField()
    colour = models.CharField(max_length=24)
   
    def __str__(self):
        return self.name
    
    class Meta(ProjectMixin.Meta):
        unique_together = ('project', 'colour')



class Item(ProjectMixin, models.Model):
    """Item Model."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    primary = models.TextField()
    secondary = models.TextField()    
    confidence = models.FloatField()

    evidence = models.ManyToManyField(Evidence, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    links = models.ManyToManyField('self', through='ItemRelation', symmetrical=True)

    def __str__(self):
        return self.primary
    
class RelationType(models.TextChoices):
    RELATES_TO = 'relates_to', 'relates_to'
    SUPPORTS = 'supports', 'supports'


class ItemRelation(models.Model):
    from_item = models.ForeignKey(Item, related_name='from_items', on_delete=models.CASCADE, null=True)
    to_item = models.ForeignKey(Item, related_name='to_items', on_delete=models.CASCADE, null=True)
    relation_type = models.CharField(
        max_length=16,
        choices=RelationType.choices,
        default=RelationType.RELATES_TO,
    )


# Guardian Optimisations

from guardian.models import UserObjectPermissionBase
from guardian.models import GroupObjectPermissionBase

class ProjectUserObjectPermission(UserObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)

class ProjectGroupObjectPermission(GroupObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)