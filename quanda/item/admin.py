from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from guardian.shortcuts import get_groups_with_perms
from item.models import Evidence, Item, System, Tag, Project
from user.models import Team

@admin.register(System)
class SystemAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'link']
    search_fields = ['name']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'colour', 'description']
    search_fields = ['name']

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['primary', 'secondary', 'confidence', 'frozen', 'priority']
    search_fields = ['primary', 'secondary']
    list_filter = ['priority', 'frozen']

class TeamInline(admin.TabularInline):
    model = Team
    extra = 1

@admin.register(Project)
class ProjectAdmin(GuardedModelAdmin):
    list_display = ('name', 'description', 'get_ownership')

    def get_ownership(self, obj):
        return ', '.join([group.name for group in get_groups_with_perms(obj, attach_perms=True) if 'change_project' in get_groups_with_perms(obj, attach_perms=True)[group]])

    get_ownership.short_description = 'Owned by'

    readonly_fields = ('get_ownership',)