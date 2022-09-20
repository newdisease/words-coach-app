from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..serializers import TranslationSerializer
from ..utils import detect_language, translate_text


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
