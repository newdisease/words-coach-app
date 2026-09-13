import time

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, OperationalError


class Command(BaseCommand):
    help = 'Wait for PostgreSQL to wake before starting or migrating the app.'

    def handle(self, *args, **options):
        deadline = time.monotonic() + 120
        while True:
            try:
                connection.ensure_connection()
                connection.close()
                return
            except OperationalError:
                connection.close()
                if time.monotonic() >= deadline:
                    raise CommandError('PostgreSQL did not become available.')
                self.stdout.write('Waiting for PostgreSQL...')
                time.sleep(2)
