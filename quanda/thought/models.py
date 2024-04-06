import datetime
from django.db import models
from uuid import uuid4


class Tag(models.Model):
    """Tag Model."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=100)
    description = models.TextField()
    colour = models.CharField(max_length=24)

    def __str__(self):
        return self.name


class Thought(models.Model):
    """Thought Model."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    content = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    entry = models.ForeignKey('Entry', on_delete=models.CASCADE)

    def __str__(self):
        return self.content


class Entry(models.Model):
    """Entry Model, using date as primary key."""

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    date = models.DateField()

