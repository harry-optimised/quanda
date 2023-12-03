from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.contrib.auth.models import Group
from user.models import User, Team

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    list_display = ('username', 'is_staff', 'last_login', 'sub')
    search_fields = ('username', 'email')
    ordering = ('username',)
    readonly_fields = ('get_teams',)

    def get_teams(self, obj):
        return ', '.join([group.name for group in obj.groups.all()])

    get_teams.short_description = 'Teams'


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    readonly_fields = ('get_members',)

    def get_members(self, obj):
        return ', '.join([user.username for user in obj.user_set.all()])

    get_members.short_description = 'Members'
