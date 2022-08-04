from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Dictionary


class DictionarySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    uk_word = serializers.CharField(max_length=20)
    en_word = serializers.CharField(max_length=20)
    progress = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)

    def create(self, validated_data):
        validated_data['progress'] = 0
        validated_data['user_id'] = self.context['user_id']
        return Dictionary.objects.create(**validated_data)

    def validate(self, data):
        uk_word = data.get('uk_word')
        en_word = data.get('en_word')
        user_id = self.context['user_id']
        if Dictionary.objects.filter(
            uk_word=uk_word, en_word=en_word, user_id=user_id
        ).exists():
            raise serializers.ValidationError('This word already exists.')
        return data
