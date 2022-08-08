from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework.test import APIClient

from django.urls import reverse


User = get_user_model()


class TestApi(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com',
            password='testpassword',
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_dictionary(self):
        response = self.client.get(reverse('dictionary-list'))
        self.assertEqual(response.status_code, 200)

    def test_post_dictionary(self):
        response = self.client.post(
            reverse('dictionary-list'),
            {
                'uk_word': 'тест',
                'en_word': 'test',
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['uk_word'], 'тест')
        self.assertEqual(response.data['en_word'], 'test')

    def test_patch_dictionary(self):
        response = self.client.post(
            reverse('dictionary-list'),
            {
                'uk_word': 'тест',
                'en_word': 'test',
            },
        )
        response = self.client.patch(
            reverse('dictionary-detail', args=[response.data['id']]),
            {
                'progress': 1,
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['progress'], 1)

    def test_delete_dictionary(self):
        response = self.client.post(
            reverse('dictionary-list'),
            {
                'uk_word': 'тест',
                'en_word': 'test',
            },
        )
        response = self.client.delete(
            reverse('dictionary-detail', args=[response.data['id']]),
        )
        self.assertEqual(response.status_code, 204)

    def test_get_dictionary_anonymous(self):
        self.client.logout()
        response = self.client.get(reverse('dictionary-list'))
        self.assertEqual(response.status_code, 401)
