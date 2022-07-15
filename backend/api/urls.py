from django.urls import path
from .views import TestModelList

urlpatterns = [
    path('', TestModelList.as_view()),
]
