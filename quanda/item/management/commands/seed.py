from django.core.management.base import BaseCommand
from guardian.shortcuts import assign_perm
from item.models import Evidence, Item, Tag, Project
from user.models import User, Team

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

        user_personal, _ = User.objects.get_or_create(sub='google-oauth2|106315701179260082674')
        user_personal.set_password('')
        user_personal.email = "henry.j.turner@gmail.com"
        user_personal.is_superuser = False
        user_personal.is_staff = False
        user_personal.save()

        self.stdout.write(self.style.HTTP_INFO("Creating Teams..."))
        team_ravonic, _ = Team.objects.get_or_create(name='Ravonic')
        team_ravonic.user_set.add(user_personal)

        self.stdout.write(self.style.HTTP_INFO("Creating Projects..."))
        project_carecrow, _ = Project.objects.get_or_create(name='CareCrow', description='CareCrow Project Description')
        assign_perm('change_project', team_ravonic, project_carecrow)

        self.stdout.write(self.style.HTTP_INFO("Creating Tags..."))
        tag_hunch, _ = Tag.objects.get_or_create(
            name="Hunch", 
            description="Just a guess at this point in time.", 
            project=project_carecrow,
            colour="rgb(172,193,138)"
        )
        tag_mvp, _ = Tag.objects.get_or_create(
            name="MVP", 
            description="Required for first release.", 
            project=project_carecrow,
            colour="rgb(152,223,175)"
        )

        self.stdout.write(self.style.HTTP_INFO("Creating Evidence..."))
        evidence_interview, _ = Evidence.objects.get_or_create(
            name="User Interview (Sarah)", 
            description="No description", 
            link="https://example.com/user-interview", 
            project=project_carecrow
        )

        self.stdout.write(self.style.HTTP_INFO("Creating Items..."))
        item_1, _ = Item.objects.get_or_create(
            primary="What state management framework should we use?", 
            secondary="Currently thinking redux.", 
            confidence=0.9, 
            project=project_carecrow
        )
        item_1.tags.set([tag_hunch, tag_mvp])

        item_2, _ = Item.objects.get_or_create(
            primary="What FE Framework should we use?", 
            secondary="I have chosen to start by using the React Native framework...",
            confidence=1.0, 
            project=project_carecrow
        )
        item_2.tags.set([tag_hunch, tag_mvp])

        item_3, _ = Item.objects.get_or_create(
            primary="How do we support regular requests? (Block booking)",
            secondary="There is a UI piece to this, but also what does it mean if a carer doesn't have that?",
            confidence=0.1, 
            project=project_carecrow
        )
        item_3.tags.set([tag_mvp])
        item_3.evidence.set([evidence_interview])

        self.stdout.write(self.style.SUCCESS("Successfully seeded database."))