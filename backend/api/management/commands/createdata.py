from django.core.management.base import BaseCommand
from api.models import Dictionary

WORDS = [
    ('брат', 'brother'),
    ('сестра', 'sister'),
    ('дід', 'grandfather'),
    ('бабуся', 'grandmother'),
    ('тато', 'father'),
    ('мамо', 'mother'),
    ('дружина', 'wife'),
    ('друг', 'friend'),
    ('помічник', 'helper'),
    ('пес', 'dog'),
    ('кіт', 'cat'),
    ('курка', 'chicken'),
    ('свиня', 'pig'),
]


class Command(BaseCommand):
    help = 'Command information'

    def handle(self, *args, **kwargs):
        for uk_word, en_word in WORDS:
            Dictionary.objects.create(
                uk_word=uk_word, en_word=en_word, user_id=1
            )
        print('Created %s words' % len(WORDS))
        print('Done')
        return 0
