# Endpoints

### Authentication Endpoints

- Registration Endpoint (POST): `/api/accounts/users/`

  ```
  {
      "email": string,
      "password": string
  }
  ```

- Token Login Endpoint (POST): `/api/accounts/token/login/`

       {
           "email": string,
           "password": string
       }

- Token Logout Endpoint (POST): `/api/accounts/token/logout/`

### Dictionary Endpoints (Be authenticated is required)

- Add a word in the dictionary (POST): `/api/dictionary/`

        {
            "uk_word": string,
            "en_word": string
        }

- Get all user words from the dictionary (GET): `/api/dictionary/`

        # example of returning data
        {
            "uk_word": "привіт",
            "en_word": "hello",
            progress: 0,
        }

- Get words from the dictionary using pagination (GET): `/api/dictionary/?limit=10&offset=0`

- Renew the progress of some word (PATCH): `/api/dictionary/{id}/`

## Quiz Endpoints (Be authenticated is required)

- Change the progress of the word (PATCH): `/api/dictionary/{id}/`

        {
            "progress": number,
        }

- Get random 10 words where progress < 3 for learning (GET): `/api/quiz/`

## Transtalion Endpoints (AllowAny)

- Translate Endpoint (POST): `/api/translate/`

        {
            "text": string,
        }

        # example of returning data
        {
            "language": string,
            "uk_word": string,
            "en_word": string,
        }

## Set of words Endpoints (Be authenticated is required)

- Add a set of words (POST): `/api/wordssets/{id}/`

        # example of returning data
        {
            "set_of_words": string,
            "added_words": [
                {
                    "uk_word": string,
                    "en_word": string,
                },
                {
                    "uk_word": string,
                    "en_word": string,
                },
            ],
            "count": number,
        }

- Get all user sets of words (GET): `/api/wordssets/`

        # example of returning data
        {
            "id": number,
            "name": string,
            "word_count": number
        }
