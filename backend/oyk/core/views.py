from django.http import JsonResponse
from django.views import View


class OykView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"error": "GET not allowed"}, status=405)

    def post(self, request, *args, **kwargs):
        return JsonResponse({"error": "POST not allowed"}, status=405)
