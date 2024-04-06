from django.core.management.base import BaseCommand
from thought.models import Thought, Tag, Entry
from user.models import User

class Command(BaseCommand):
    help = "Seed the database with initial data."

    def handle(self, *args, **options):
        """Seed the database with initial data."""

        self.stdout.write(self.style.HTTP_INFO("Creating Users..."))
        user_admin, _ = User.objects.get_or_create(username='admin')
        user_admin.set_password('admin')
        user_admin.is_superuser = True
        user_admin.is_staff = True
        user_admin.save()

        self.stdout.write(self.style.HTTP_INFO("Creating Tags..."))
        tag_sleep, _ = Tag.objects.get_or_create(
            name="sleep", 
            description="For thoughts about sleep.", 
            colour="rgb(185,131,137)"
        )
        tag_projects, _ = Tag.objects.get_or_create(
            name="projects", 
            description="For thoughts about projects.", 
            colour="rgb(181,157,164)"
        )

        self.stdout.write(self.style.HTTP_INFO("Creating entry 1..."))
        entry_1 = Entry.objects.create(date="2021-01-01")
        item_1, _ = Thought.objects.get_or_create(
            content="I think we should use React Native for the mobile app.",
            entry=entry_1,
        )
        item_1.tags.set([tag_projects])

        item_2, _ = Thought.objects.get_or_create(
            content="I think we should use Django for the backend.",
            entry=entry_1,
        )
        item_2.tags.set([tag_projects])

        item_3, _ = Thought.objects.get_or_create(
            content="I have not been sleeping well at all lately.",
            entry=entry_1,
        )
        item_3.tags.set([tag_sleep])

        self.stdout.write(self.style.HTTP_INFO("Creating entry 2..."))
        entry_2 = Entry.objects.create(date="2021-01-02")
        item_4, _ = Thought.objects.get_or_create(
            content="I'm going to try going to bed earlier each night this week.",
            entry=entry_2,
        )
        item_4.tags.set([tag_sleep])

        item_5, _ = Thought.objects.get_or_create(
            content="Need to add more testing to Djano. I think we should use pytest.",
            entry=entry_2,
        )
        item_5.tags.set([tag_projects])

        self.stdout.write(self.style.SUCCESS("Successfully seeded database."))