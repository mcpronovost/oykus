from django.contrib.auth import get_user_model
from django.http import JsonResponse

from oyk.core.views import OykView
from oyk.contrib.world.models import OykUniverse

OykUser = get_user_model()


class OykUniversesListView(OykView):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"ok": True})


class OykUniverseView(OykView):
    def get(self, request, *args, **kwargs):
        universe = OykUniverse.objects.current(request.user, kwargs["slug"])

        if universe is None:
            return JsonResponse({}, status=404)

        return JsonResponse(
            {
                "ok": True,
                "universe": universe,
            }
        )


class OykUniverseCommunityView(OykView):
    def get(self, request, *args, **kwargs):
        users = OykUser.objects.filter(
            is_active=True
        ).short()

        return JsonResponse(
            {
                "ok": True,
                "users": users,
            }
        )
