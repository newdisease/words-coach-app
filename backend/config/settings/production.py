from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
ALLOWED_HOSTS = [
    '0.0.0.0',
    'words-coach-app.fun',
    'www.words-coach-app.fun',
]

CSRF_TRUSTED_ORIGINS = [
    'https://words-coach-app.fun',
    'https://www.words-coach-app.fun',
]

# Apps that will work only in development mode
INSTALLED_APPS += []

# Middlewares that will work only in development mode
MIDDLEWARE += []

# Setting for django-cors-headers library
CORS_ALLOW_ALL_ORIGINS = True

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# Parse database connection url strings
# like psql://user:pass@127.0.0.1:8458/db

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env('DATABASE_NAME'),
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST', default='db'),
        'PORT': '5432',
    }
}
