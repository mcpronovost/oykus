from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health(request):
    return JsonResponse({"status": "ok"})


def heartbeat(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("oyk.contrib.urls")),
    path("api/health/", health),
    path("api/heartbeat/", heartbeat),
]
