from django.core.cache import cache
from django.utils import timezone

from oyk.core.utils import get_ip


class OykWIOMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            cache_key = f"lastlive_{request.user.pk}"
            if not cache.get(cache_key):
                request.user.__class__.objects.filter(
                    pk=request.user.pk
                ).update(
                    lastlive_at=timezone.now(),
                    lastlive_ip=get_ip(request),
                )
                cache.set(cache_key, True, timeout=180)
        return response
