from django.db import models


class TestModel(models.Model):
    '''Test model to check if the application works'''

    name = models.CharField(max_length=100)
    age = models.IntegerField()

    class Meta:
        verbose_name = 'Test Model'
        verbose_name_plural = 'Test Models'

    def __str__(self):
        return self.name
