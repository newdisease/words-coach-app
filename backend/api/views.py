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
