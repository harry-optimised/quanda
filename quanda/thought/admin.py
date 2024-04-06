from django.contrib import admin
from thought.models import Thought, Tag, Entry

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'colour', 'description']
    search_fields = ['name']


class ThoughtInline(admin.TabularInline):
    model = Thought
    extra = 0  # This removes the extra empty forms for new objects

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'updated_at']
    search_fields = ['id']
    inlines = [ThoughtInline]

@admin.register(Thought)
class ThoughtAdmin(admin.ModelAdmin):
    list_display = ['content', 'entry', 'created_at', 'updated_at']
    search_fields = ['content', 'entry__id']  # This allows searching by content and the entry ID

