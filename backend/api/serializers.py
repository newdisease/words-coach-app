import re

from rest_framework import serializers

from .models import Dictionary


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


class ListOfWordsSetsSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=20, read_only=True)
    word_count = serializers.SerializerMethodField()

    def get_word_count(self, obj):
        return obj.words.count()


class DeleteListOfWordsSetsSerializer(serializers.Serializer):
    words = serializers.ListField(child=serializers.DictField())
