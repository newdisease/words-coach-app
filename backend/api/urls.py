from django.urls import path
from rest_framework import routers

from api.views import dictionary_views, translate_views, wordssets_views

app_name = 'api'

router = routers.SimpleRouter()

router.register(
    r'dictionary', dictionary_views.DictionaryCreateListViewSet, 'dictionary'
)
router.register(r'quiz', dictionary_views.DictionaryRandomViewSet, 'quiz')

urlpatterns = [
    path(
        'translate/',
        translate_views.TranslationCreateView.as_view(),
        name='translate',
    ),
    path(
        'dictionary/delete/',
        wordssets_views.DeleteWordsFromUserDictionaryView.as_view(),
        name='deletewords',
    ),
    path(
        'wordssets/',
        wordssets_views.ListOfWordsSetsView.as_view(),
        name='wordssets',
    ),
    path(
        'wordssets/<int:pk>/',
        wordssets_views.AddWordsInUserDictionaryView.as_view(),
        name='addwords',
    ),
]


urlpatterns += router.urls
