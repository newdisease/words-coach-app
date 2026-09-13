from django.http import JsonResponse


def health(request):
    # Probes must not repeatedly wake a sleeping database.
    return JsonResponse({'status': 'ok'})
