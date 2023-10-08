from typing import Any, Dict
from django import forms
from django.contrib import admin
from .models import Task, Run, Tag
from api.validators import InputsSerializer, OutputsSerializer
from django.core.exceptions import ValidationError

class TaskAdminForm(forms.ModelForm):
    
    inputs = forms.JSONField(required=False)
    outputs = forms.JSONField(required=False)

    class Meta:
        model = Task
        fields = '__all__'

    def clean_inputs(self):
        data = self.cleaned_data['inputs']
        serializer = InputsSerializer(data=data, many=True)
        if not serializer.is_valid():
            raise ValidationError(serializer.errors)
        return data

    def clean_outputs(self):
        data = self.cleaned_data['outputs']
        serializer = OutputsSerializer(data=data, many=True)
        if not serializer.is_valid():
            raise ValidationError(serializer.errors)
        return data
    

class TaskAdmin(admin.ModelAdmin):
    
    form = TaskAdminForm

    list_display = ['id', 'name', 'user', 'created']
    search_fields = ['name', 'user__username']
    list_filter = ['created', 'user']
    raw_id_fields = ['user']

    def formfield_for_dbfield(self, db_field, **kwargs):
        formfield = super().formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'inputs' or db_field.name == 'outputs':
            formfield.widget = forms.Textarea(attrs=formfield.widget.attrs)
        return formfield

  

class RunAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'task', 'status']
    search_fields = ['task__name', 'status']
    list_filter = ['status'] 

class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'task']
    search_fields = ['name', 'task__name']


admin.site.register(Task, TaskAdmin)
admin.site.register(Run, RunAdmin)
admin.site.register(Tag, TagAdmin)
