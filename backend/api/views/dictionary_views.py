from django.db.models import Q
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    UpdateModelMixin,
)
from rest_framework.viewsets import GenericViewSet

from ..models import Dictionary
from ..serializers import DictionarySerializer


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
