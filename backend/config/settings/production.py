from .base import *

DEBUG = False
fly_app = env('FLY_APP_NAME', default='words-coach-app')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[f'{fly_app}.fly.dev', 'localhost', '127.0.0.1'])
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=[f'https://{fly_app}.fly.dev'])
CORS_ALLOW_ALL_ORIGINS = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_CONTENT_TYPE_NOSNIFF = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

if env('DATABASE_URL', default=''):
    DATABASES = {'default': env.db('DATABASE_URL')}
else:
    DATABASES = {'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DATABASE_NAME'),
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST', default='db'),
        'PORT': env('DATABASE_PORT', default='5432'),
    }}

# Close connections after each request so an idle database can sleep.
DATABASES['default']['CONN_MAX_AGE'] = 0
DATABASES['default'].setdefault('OPTIONS', {})['connect_timeout'] = 30
