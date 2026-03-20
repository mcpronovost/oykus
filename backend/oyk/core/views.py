from django.apps import apps
from django.core.cache import cache
from django.http import JsonResponse
from django.views import View

HEARTBEAT_CACHE_KEY = "heartbeat_data"
HEARTBEAT_CACHE_TIMEOUT = 10


class OykView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"error": "GET not allowed"}, status=405)

    def post(self, request, *args, **kwargs):
        return JsonResponse({"error": "POST not allowed"}, status=405)


class OykHeartbeatView(OykView):
    def get(self, request, *args, **kwargs):
        cached = cache.get(HEARTBEAT_CACHE_KEY)
        if cached:
            return JsonResponse(cached, status=200)

        user = None
        worldCurrent = None
        worldUniverses = []
        notifications = None

        try:
            if not request.user.is_authenticated:
                user = request.user.get_me_data()
        except Exception:
            pass

        data = {
            "ok": True,
            "user": user,
            "world": {
                "current": worldCurrent,
                "universes": worldUniverses,
            },
            "notifications": notifications,
        }

        cache.set(HEARTBEAT_CACHE_KEY, data, HEARTBEAT_CACHE_TIMEOUT)

        return JsonResponse(data, status=200)
