from rest_framework import serializers
from .models import Dictionary


# serializer for Dictionary model
class DictionarySerializer(serializers.ModelSerializer):
    progress = serializers.IntegerField(read_only=True)

    class Meta:
        model = Dictionary
        fields = ('id', 'uk_word', 'en_word', 'progress')
