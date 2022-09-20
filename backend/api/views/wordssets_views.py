from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from ..models import Dictionary, WordInSet, WordsSet
from ..serializers import ListOfWordsSetsSerializer


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
