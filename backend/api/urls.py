from django.urls import path
from rest_framework import routers
from api.views import DictionaryCreateListViewSet

router = routers.SimpleRouter()

router.register(r'dictionary', DictionaryCreateListViewSet, 'dictionary')

urlpatterns = router.urls
