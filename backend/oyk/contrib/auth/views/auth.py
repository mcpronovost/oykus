import re
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator

from oyk.core.utils import get_ip
from oyk.core.views import OykView

User = get_user_model()


class OykRegisterView(OykView):
    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        confirm_password = request.POST.get("confirmPassword", "")
        email = request.POST.get("email", "").strip()
        name = request.POST.get("name", "").strip()

        # --- Validation ---
        if not all([username, password, confirm_password, email, name]):
            return JsonResponse(
                {"error": "All fields are required"},
                status=400,
            )

        password_pattern = re.compile(
            r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$"  # noqa: E501
        )

        if not password_pattern.match(password):
            return JsonResponse(
                {
                    "error": "An error occurred",
                    "fields": {
                        "password": (
                            "Password must be at least 8 characters and "
                            "include an uppercase letter, a lowercase "
                            "letter, a number, and a special character"
                        )
                    },
                },
                status=400,
            )

        if password != confirm_password:
            return JsonResponse(
                {
                    "error": "An error occurred",
                    "fields": {
                        "password": (
                            "Passwords do not match"
                        ),
                        "confirmPassword": (
                            "Passwords do not match"
                        )
                    },
                },
                status=400,
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {
                    "error": "An error occurred",
                    "fields": {
                        "username": (
                            "Username already taken"
                        ),
                    },
                },
                status=409,
            )

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {
                    "error": "An error occurred",
                    "fields": {
                        "email": (
                            "Email already registered"
                        ),
                    },
                },
                status=409,
            )

        if User.objects.filter(name=name).exists():
            return JsonResponse(
                {
                    "error": "An error occurred",
                    "fields": {
                        "name": (
                            "Name already taken"
                        ),
                    },
                },
                status=409,
            )

        # --- Create user ---
        user = User.objects.create_user(
            username=username, password=password, email=email, name=name
        )
        user.save()

        return JsonResponse({"ok": True}, status=201)


@method_decorator(csrf_exempt, name="dispatch")
class OykLoginView(OykView):
    def post(self, request, *args, **kwargs):
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is None:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        if user.is_currently_banned():
            return JsonResponse(
                {
                    "error": "Banned",
                    "until": user.banned_until,
                    "reason": user.banned_reason,
                },
                status=401,
            )

        if user.is_currently_locked():
            return JsonResponse(
                {
                    "error": "Locked",
                    "until": user.locked_until,
                },
                status=401,
            )

        login(request, user)
        csrf_token = get_token(request)
        user_data = user.get_me_data()

        user.reset_failed_login()
        user.record_login(get_ip(request))

        return JsonResponse({"ok": True, "rat": csrf_token, "user": user_data})


class OykLogoutView(OykView):
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Not logged in"}, status=401)

        logout(request)
        return JsonResponse({"ok": True})
