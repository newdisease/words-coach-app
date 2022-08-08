# Endpoints
### Authentication Endpoints


 -   Registration Endpoint (POST): `/api/accounts/users/`

        ```
        {
            "email": string,
            "password": string
        }
        ```
-  Token Login Endpoint (POST): `/api/accounts/token/login/`

        {
            "email": string,
            "password": string
        }



## Be authenticated is required for all other endpoints
***


- Token Logout Endpoint (POST): `/api/accounts/token/logout/`



### Dictionary Endpoints

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


## Quiz Endpoints


- Change the progress of the word (PATCH): `/api/dictionary/{id}/`

        {
            "progress": number,
        }

- Get random 10 words where progress < 3 for learning (GET): `/api/dictionary/quiz/`

