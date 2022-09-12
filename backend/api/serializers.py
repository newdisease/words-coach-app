from rest_framework import serializers
from .models import Dictionary

import re


class DictionarySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    uk_word = serializers.CharField(max_length=20)
    en_word = serializers.CharField(max_length=20)
    progress = serializers.IntegerField(default=0)

    def create(self, validated_data):
        validated_data['user_id'] = self.context['user_id']
        return Dictionary.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.uk_word = validated_data.get('uk_word', instance.uk_word)
        instance.en_word = validated_data.get('en_word', instance.en_word)
        instance.progress = validated_data.get('progress', instance.progress)
        instance.save()
        return instance

    def validate(self, data):
        uk_word = data.get('uk_word')
        en_word = data.get('en_word')
        user_id = self.context['user_id']
        if Dictionary.objects.filter(
            uk_word=uk_word, en_word=en_word, user_id=user_id
        ).exists():
            raise serializers.ValidationError('This word already exists.')
        return data


class TranslationSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=15)

    def validate(self, data):
        word = data.get('word')
        if not re.match(r"^[а-яА-ЯіІїЇa-zA-Z\s'` ]+$", word):
            raise serializers.ValidationError('This word is not valid.')
        return data
