# Generated by Django 4.2.4 on 2023-08-25 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_remove_task_branch_task_commit_alter_task_repository'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='script',
            field=models.TextField(default=''),
        ),
    ]
