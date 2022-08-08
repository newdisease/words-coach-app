from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    def handle(self, *args, **options):
        if User.objects.count() == 0:
            email = 'admin@admin.com'
            password = 'adminadmin'
            print('Creating account for %s (%s)' % (email, email))
            admin = User.objects.create_superuser(
                email=email, password=password
            )
            admin.is_active = True
            admin.is_admin = True
            admin.save()
        else:
            print('Admin accounts can only be initialized if no Accounts exist')
