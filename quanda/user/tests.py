from django.test import TestCase
from user.models import User
from thought.models import Thought

class UserTestCase(TestCase):
    
    def test_onboarding_is_run_on_user_creation(self):
        """Creating a user creates a new project, items etc that they have permission for."""

        # When - A user is created
        user = User.objects.create_user(username='testuser')

        # Then - A project exists called 'Sandbox' and the user has 'change_project' permission on it.
        # self.assertEqual(Project.objects.count(), 1)
        # self.assertEqual(Project.objects.first().name, 'Sandbox')
        # self.assertTrue(user.has_perm('change_project', Project.objects.first()))

        # # Also - There is one new tag called 'example' and it belongs to the Sandbox project.
        # self.assertEqual(Project.objects.first().tag_set.count(), 1)
        # self.assertEqual(Project.objects.first().tag_set.first().name, 'example')

        # # Also - There is one new item called 'Welcome to Quanda',it belongs to the Sandbox project, has tag example.
        # self.assertEqual(Item.objects.count(), 1)
        # self.assertEqual(Item.objects.first().primary, 'Welcome to Quanda')
        # self.assertEqual(Item.objects.first().project, Project.objects.first())
        # self.assertEqual(Item.objects.first().tags.count(), 1)
        # self.assertEqual(Item.objects.first().tags.first().name, 'example')
