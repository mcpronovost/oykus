from django.http import JsonResponse

from oyk.core.views import OykView
from oyk.contrib.world.models import OykUniverse, OykRole


class OykUniversesListView(OykView):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"ok": True})


class OykUniverseView(OykView):
    def get(self, request, *args, **kwargs):
        universe = OykUniverse.objects.filter(slug=kwargs["slug"]).first()

        if universe is None:
            return JsonResponse({}, status=404)

        data = universe.get_short_data()
        staff = OykRole.get_universe_members(universe)

        data["staff"] = staff

        return JsonResponse(
            {
                "ok": True,
                "universe": data,
            }
        )
