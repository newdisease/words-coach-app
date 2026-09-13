from django.contrib import admin
from django.urls import path, include
from accounts.views import GoogleLogin
from .health import health


urlpatterns = [
    path('healthz', health),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/accounts/', include('dj_rest_auth.urls')),
    path(
        'api/accounts/registration/', include('dj_rest_auth.registration.urls')
    ),
    path('api/accounts/google/', GoogleLogin.as_view(), name='google_login'),
    # allauth needs this route when a social email matches an existing
    # password-based account. The API serializer then returns its normal
    # validation error instead of failing while reversing this URL.
    path('accounts/', include('allauth.urls')),
]
