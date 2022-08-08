from rest_framework.mixins import (
    ListModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.viewsets import GenericViewSet
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
        return Dictionary.objects.filter(user_id=self.request.user.id)

    def get_serializer_context(self):
        return {'user_id': self.request.user.id}


class DictionaryRandomViewSet(ListModelMixin, GenericViewSet):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        return Dictionary.objects.filter(
            user_id=self.request.user.id, progress__lt=3
        ).order_by('?')[:5]

    def get_serializer_context(self):
        return {'user_id': self.request.user.id}
