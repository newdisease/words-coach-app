from rest_framework import generics
from .models import TestModel
from .serializers import TestModelSerializer


class TestModelList(generics.ListCreateAPIView):
    '''Test view to check if the application works'''

    queryset = TestModel.objects.all()
    serializer_class = TestModelSerializer
    name = 'test-model-list'
