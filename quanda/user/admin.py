from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from user.models import User

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    list_display = ('username', 'is_staff', 'last_login', 'sub')
    search_fields = ('username', 'email')
    ordering = ('username',)


