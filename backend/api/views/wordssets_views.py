from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from ..models import Dictionary, WordInSet, WordsSet
from ..serializers import (
    DeleteListOfWordsSetsSerializer,
    ListOfWordsSetsSerializer,
)


class ListOfWordsSetsView(ListAPIView):
    serializer_class = ListOfWordsSetsSerializer
    queryset = WordsSet.objects.all()


class AddWordsInUserDictionaryView(CreateAPIView):
    def get_queryset(self):
        return WordInSet.objects.filter(words_set_id=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        added_words = []
        count = 0
        set_of_words = WordsSet.objects.get(id=self.kwargs['pk']).name
        for word in queryset:
            if not Dictionary.objects.filter(
                user_id=self.request.user.id,
                uk_word=word.uk_word,
                en_word=word.en_word,
            ):
                Dictionary.objects.create(
                    user_id=self.request.user.id,
                    uk_word=word.uk_word,
                    en_word=word.en_word,
                )
                added_words.append(
                    {'uk_word': word.uk_word, 'en_word': word.en_word}
                )
                count += 1
        if count == 0:
            return Response(
                {
                    'message': 'All words from set are exists.',
                    'words_set': set_of_words,
                }
            )

        else:
            return Response(
                {
                    'set_of_words': set_of_words,
                    'added_words': added_words,
                    'count': count,
                }
            )


class DeleteWordsFromUserDictionaryView(CreateAPIView):
    serializer_class = DeleteListOfWordsSetsSerializer

    def get_queryset(self):
        return Dictionary.objects.filter(user_id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        words = serializer.validated_data['words']
        deleted_words_count = 0
        deleted_words_in_progress_count = 0
        for word in words:
            if queryset.filter(
                uk_word=word['uk_word'], en_word=word['en_word']
            ).exists():
                obj = queryset.get(
                    uk_word=word['uk_word'], en_word=word['en_word']
                )
                if obj.progress > 2:
                    deleted_words_in_progress_count += 1
                deleted_words_count += 1
                obj.delete()
        if deleted_words_count == 0:
            return Response(
                {'message': 'Words are not found in your dictionary.'}
            )
        else:
            return Response(
                {
                    'deleted_words': deleted_words_count,
                    'deleted_words_in_progress': deleted_words_in_progress_count,
                }
            )
