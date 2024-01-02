from django.db import models
from rest_framework import serializers
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


# Import/Export
###############
    
API_VERSION = '0.1'
    
class ExportTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ExportItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

def export_project(project: Project) -> dict:
    """Export a list of items and tags to a dict."""

    items = Item.objects.filter(project=project)
    tags = Tag.objects.filter(project=project)

    return {
        'meta': {
            'name': project.name,
            'description': project.description,
            'api_version': API_VERSION
        },
        'items': ExportItemSerializer(items, many=True).data,
        'tags': ExportTagSerializer(tags, many=True).data,
    }

def import_project(project: Project, data: dict):
    """Import a list of items and tags from a dict."""

    # Meta
    ######

    if data['meta']['api_version'] != API_VERSION:
        raise Exception('API version mismatch.')
    

    # Tags
    ######

    tags = {}
    _tags = data['tags']

    for _tag in _tags:
        
        _t_id = _tag.pop('id', None)
        _tag['project'] = project
    
        tag_objects = Tag.objects.filter(name=_tag['name'].lower(), project=project)

        if tag_objects.exists():
            tag = tag_objects.first()
        else:
            tag = Tag.objects.create(**_tag)
        
        tags[_t_id] = tag


    # Items
    #######

    _items = data['items']

    for _item in _items:

        _item.pop('id', None)
        _item.pop('evidence', None)
        _item.pop('links', None)
        _i_tags = _item.pop('tags', None)
        _item['project'] = project

        item_objects = Item.objects.filter(primary=_item['primary'], project=project)
        
        if item_objects.exists():
            item = item_objects.first()
        else:
            item = Item.objects.create(**_item)  

      
        _i_tag_set = [tags[t] for t in _i_tags]
        item.tags.set(_i_tag_set)
        item.save()


# Guardian Optimisations
########################

from guardian.models import UserObjectPermissionBase
from guardian.models import GroupObjectPermissionBase

class ProjectUserObjectPermission(UserObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)

class ProjectGroupObjectPermission(GroupObjectPermissionBase):
    content_object = models.ForeignKey(Project, on_delete=models.CASCADE)