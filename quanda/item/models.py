from django.db import models
from django.core.exceptions import ValidationError
from guardian.shortcuts import get_perms, assign_perm

class ColourChoices(models.TextChoices):
    NEUTRAL = 'neutral'
    GREEN = 'green'
    BLUE = 'blue'
    RED = 'red'
    ORANGE = 'orange'
    PURPLE = 'purple'
    YELLOW = 'yellow'
    TEAL = 'teal'
    
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
    colour = models.CharField(max_length=10, choices=ColourChoices.choices)

    def __str__(self):
        return self.name
    
    class Meta(ProjectMixin.Meta):
        unique_together = ('project', 'colour')

    def save(self, *args, **kwargs):

        # Check if there are already 8 tags in the project
        existing_tags_count = Tag.objects.filter(project=self.project).count()
        if existing_tags_count >= 8:
            raise ValidationError("Maximum of 8 tags allowed per project.")

        # Get the set of colours already used in the project
        used_colours = set(Tag.objects.filter(project=self.project).values_list('colour', flat=True))

        # Find an unused colour
        available_colours = set(ColourChoices.values) - used_colours
        if available_colours:
            self.colour = available_colours.pop()  # Take any colour from the available set
        else:
            raise ValidationError("No available colours left.")

        super().save(*args, **kwargs)


class Item(ProjectMixin, models.Model):
    """Item Model."""

    primary = models.TextField()
    secondary = models.TextField()    
    confidence = models.FloatField()
    frozen = models.BooleanField(default=False)    
    priority = models.BooleanField(default=False)

    system = models.ForeignKey(System, on_delete=models.SET_NULL, null=True)
    evidence = models.ManyToManyField(Evidence, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    links = models.ManyToManyField('self', through='ItemRelation', symmetrical=True)

    def __str__(self):
        return self.primary
    
class RelationType(models.TextChoices):
    RELATES_TO = 'relates_to', 'relates_to'
    SUPPORTS = 'supports', 'supports'


class ItemRelation(models.Model):
    from_item = models.ForeignKey(Item, related_name='from_items', on_delete=models.SET_NULL, null=True)
    to_item = models.ForeignKey(Item, related_name='to_items', on_delete=models.SET_NULL, null=True)
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