from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer

from api.models import Dictionary


class CustomUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    words_in_progress = serializers.SerializerMethodField()

    def get_words_in_progress(self, obj):
        return Dictionary.objects.filter(user_id=obj.id, progress__lt=3).count()


class CustomRegisterSerializer(RegisterSerializer):
    username = None
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def save(self, request):
        user = super().save(request)
        user.email = self.validated_data['email']
        user.save()
        return user
