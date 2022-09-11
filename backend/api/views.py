from rest_framework.mixins import (
    ListModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q

from .models import Dictionary
from .serializers import DictionarySerializer


class DictionaryCreateListViewSet(
    ListModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        queryset = Dictionary.objects.filter(user_id=self.request.user.id)
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
