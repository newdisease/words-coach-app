from django.core.management.base import BaseCommand
from api.models import TestModel


class Command(BaseCommand):
    help = 'Command information'

    def handle(self, *args, **kwargs):

        TestModel.objects.create(name='John Doe', age=20)
        TestModel.objects.create(name='Alex Couper', age=30)
        TestModel.objects.create(name='Jane Doe', age=40)
