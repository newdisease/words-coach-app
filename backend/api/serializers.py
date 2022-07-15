from rest_framework import serializers
from .models import TestModel


class TestModelSerializer(serializers.ModelSerializer):
    '''Test serializer to check if the application works'''

    class Meta:
        model = TestModel
        fields = ('id', 'name', 'age')
