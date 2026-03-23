from django.contrib.auth import get_user_model
from django.http import JsonResponse

from oyk.core.views import OykView

OykUser = get_user_model()


class OykUserProfileView(OykView):
    def get(self, request, *args, **kwargs):
        user = OykUser.objects.filter(
            is_active=True, slug=kwargs["slug"]
        ).first()

        if not user:
            return JsonResponse({"error": "Not found"}, status=404)

        data = {
            "id": user.pk,
            "name": user.name,
            "avatar": user.avatar.url if user.avatar else None,
            "cover": user.cover.url if user.cover else None,
            "meta_bio": user.meta_bio,
            "meta_country": user.meta_country,
            "meta_birthday": user.meta_birthday,
            "meta_job": user.meta_job,
            "meta_mood": user.meta_mood,
            "meta_website": user.meta_website,
            "meta_socials": user.meta_socials,
            "lastlive_at": user.lastlive_at,
            "created_at": user.created_at,
        }

        return JsonResponse({"ok": True, "user": data})
