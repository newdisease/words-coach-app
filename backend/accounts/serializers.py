from rest_framework import serializers

from api.models import Dictionary


class UserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    words_in_progress = serializers.SerializerMethodField()

    def get_words_in_progress(self, obj):
        return Dictionary.objects.filter(user_id=obj.id, progress__lt=3).count()
