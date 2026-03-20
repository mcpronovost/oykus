from django.http import JsonResponse

from oyk.core.views import OykView


class OykMeView(OykView):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"ok": True})
