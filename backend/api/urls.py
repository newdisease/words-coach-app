from rest_framework import routers
from api.views import (
    DictionaryCreateListViewSet,
    DictionaryRandomViewSet,
)

app_name = 'api'

router = routers.SimpleRouter()

router.register(r'dictionary', DictionaryCreateListViewSet, 'dictionary')
router.register(r'quiz', DictionaryRandomViewSet, 'quiz')


urlpatterns = router.urls
