from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from .models import Dictionary
from .serializers import DictionarySerializer


class DictionaryCreateListViewSet(
    ListModelMixin, CreateModelMixin, GenericViewSet
):
    serializer_class = DictionarySerializer

    def get_queryset(self):
        return Dictionary.objects.filter(user_id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id, progress=0)
