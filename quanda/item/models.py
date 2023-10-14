from django.db import models
from guardian.shortcuts import get_perms, assign_perm

URGENCY_CHOICES = [
        ('CW', 'Can Wait'),
        ('AS', 'Answer Soon'),
        ('B', 'Blocking'),
    ]

class Project(models.Model):
    """Project Model."""

    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class ProjectMixin(models.Model):
    """Mixin to add a Project relationship."""

    project = models.ForeignKey(Project, related_name='%(class)s_related', on_delete=models.CASCADE, db_index=True)

    class Meta:
        abstract = True

    def can_be_accessed_by(self, user):
        return 'change_project' in get_perms(user, self.project)


class System(ProjectMixin, models.Model):
    """System Model."""

    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class Evidence(ProjectMixin, models.Model):
    """Evidence Model."""

    name = models.CharField(max_length=100)
    description = models.TextField()
    link = models.URLField()

    def __str__(self):
        return self.name
    

class Tag(ProjectMixin, models.Model):
    """Tag Model."""

    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Item(ProjectMixin, models.Model):
    """Item Model."""

    primary = models.TextField()
    secondary = models.TextField()    
    confidence = models.FloatField()
    frozen = models.BooleanField(default=False)    
    urgency = models.CharField(max_length=2, choices=URGENCY_CHOICES)

    system = models.ForeignKey(System, on_delete=models.SET_NULL, null=True)
    evidence = models.ManyToManyField(Evidence, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.primary
    

# Guardian Optimisations

from guardian.models import UserObjectPermissionBase
from guardian.models import GroupObjectPermissionBase

class ProjectUserObjectPermission(UserObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)

class ProjectGroupObjectPermission(GroupObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)