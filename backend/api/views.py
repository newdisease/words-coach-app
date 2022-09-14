from django.db.models import Q
from rest_framework.generics import CreateAPIView
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    UpdateModelMixin,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import Dictionary
from .serializers import DictionarySerializer, TranslationSerializer
from .utils import detect_language, translate_text


class DictionaryCreateListViewSet(
    ListModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        queryset = Dictionary.objects.filter(
            user_id=self.request.user.id
        ).order_by('id')
        query_params = self.request.query_params.get('search')
        if query_params:
            return queryset.filter(
                Q(uk_word__icontains=query_params)
                | Q(en_word__icontains=query_params)
            )
        return Dictionary.objects.filter(user_id=self.request.user.id)

    def get_serializer_context(self):
        return {'user_id': self.request.user.id}


class DictionaryRandomViewSet(ListModelMixin, GenericViewSet):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        return Dictionary.objects.filter(
            user_id=self.request.user.id, progress__lt=3
        ).order_by('?')[:10]

    def get_serializer_context(self):
        return {'user_id': self.request.user.id}


class TranslationCreateView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = TranslationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        word = serializer.validated_data['word']
        language = detect_language(word)
        return Response(
            {'language': language, **translate_text(word, language)}
        )
