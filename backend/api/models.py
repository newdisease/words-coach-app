from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Dictionary(TimeStampedModel):
    uk_word = models.CharField(max_length=20)
    en_word = models.CharField(max_length=20)
    progress = models.IntegerField(default=0)
    user = models.ForeignKey(
        User, related_name='dictionary', on_delete=models.CASCADE
    )

    def __str__(self):
        return self.uk_word + ' - ' + self.en_word

    class Meta:
        verbose_name_plural = 'Dictionary'
        unique_together = ('uk_word', 'en_word', 'user_id')
        ordering = ('progress', '-created_at')


class WordsSet(TimeStampedModel):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

    def save(
        self,
        force_insert=False,
        force_update=False,
        using=None,
    ):
        self.name = self.name.lower()
        super().save()

    class Meta:
        verbose_name_plural = 'Words sets'


class WordInSet(TimeStampedModel):
    en_word = models.CharField(max_length=20)
    uk_word = models.CharField(max_length=20)
    words_set = models.ForeignKey(
        WordsSet, related_name='words', on_delete=models.CASCADE
    )

    def __str__(self):
        return self.uk_word + ' - ' + self.en_word

    def save(
        self,
        force_insert=False,
        force_update=False,
        using=None,
    ):
        self.en_word = self.en_word.lower()
        self.uk_word = self.uk_word.lower()
        super().save()

    class Meta:
        verbose_name_plural = 'Words in sets'
        unique_together = ('en_word', 'uk_word', 'words_set_id')
        ordering = ('-created_at',)
