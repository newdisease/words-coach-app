from rest_framework import routers
from django.urls import path
from api.views import (
    DictionaryCreateListViewSet,
    DictionaryRandomViewSet,
    TranslationCreateView,
)

app_name = 'api'

router = routers.SimpleRouter()

router.register(r'dictionary', DictionaryCreateListViewSet, 'dictionary')
router.register(r'quiz', DictionaryRandomViewSet, 'quiz')

urlpatterns = [
    path('translate/', TranslationCreateView.as_view(), name='translate'),
]


urlpatterns += router.urls
