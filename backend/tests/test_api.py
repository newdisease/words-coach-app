from api.models import Dictionary, WordInSet, WordsSet
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

User = get_user_model()


class TestApi(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com',
            password='testpassword',
        )
        self.word = Dictionary.objects.create(
            uk_word='тест',
            en_word='test',
            user=self.user,
        )

        self.words_set = WordsSet.objects.create(
            name='test_set',
        )

        self.word_in_set = WordInSet.objects.create(
            uk_word='тестест', en_word='testtest', words_set=self.words_set
        )

        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_get_dictionary(self):
        response = self.client.get(reverse('api:dictionary-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_patch_dictionary(self):
        response = self.client.patch(
            reverse('api:dictionary-detail', args=[self.word.id]),
            {
                'progress': 1,
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['progress'], 1)

    def test_post_dictionary(self):
        response = self.client.post(
            reverse('api:dictionary-list'),
            {
                'uk_word': 'тест1',
                'en_word': 'test1',
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['uk_word'], 'тест1')
        self.assertEqual(response.data['en_word'], 'test1')
        self.assertEqual(len(Dictionary.objects.all()), 2)

    def test_delete_dictionary(self):
        response = self.client.delete(
            reverse('api:dictionary-detail', args=[self.word.id]),
        )
        self.assertEqual(response.status_code, 204)

    def test_get_dictionary_anonymous(self):
        self.client.logout()
        response = self.client.get(reverse('api:dictionary-list'))
        self.assertEqual(response.status_code, 401)

    def test_get_words_for_quiz(self):
        response = self.client.get(reverse('api:quiz-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_post_translation(self):
        response = self.client.post(
            reverse('api:translate'),
            {
                'word': 'test',
            },
        )
        self.assertEqual(response.status_code, 200)

    def test_words_sets(self):
        response = self.client.get(reverse('api:wordssets'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_add_words_in_user_dictionary(self):
        response = self.client.post(reverse('api:addwords', args=[1]))
        self.assertEqual(
            response.data,
            {
                'set_of_words': 'test_set',
                'added_words': [{'uk_word': 'тестест', 'en_word': 'testtest'}],
                'count': 1,
            },
        )

    def test_delete_words_from_user_dictionary(self):
        data = dict(uk_word='тестест', en_word='testtest')
        Dictionary.objects.create(**data, user=self.user)
        response = self.client.post(
            reverse('api:deletewords'), data={'words': [data]}, format='json'
        )
        self.assertEqual(
            response.data,
            {
                'deleted_words': 1,
                'deleted_words_in_progress': 1,
            },
        )
