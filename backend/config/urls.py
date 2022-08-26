from django.contrib import admin
from django.urls import path, include
from accounts.views import GoogleLogin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/accounts/', include('dj_rest_auth.urls')),
    path(
        'api/accounts/registration/', include('dj_rest_auth.registration.urls')
    ),
    path('api/accounts/google/', GoogleLogin.as_view(), name='google_login'),
]
