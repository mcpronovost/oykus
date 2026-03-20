from django.urls import path

from .views import (
    OykRegisterView,
    OykLoginView,
    OykLogoutView,
    OykMeView,
)


urlpatterns = [
    path("register/", OykRegisterView.as_view(), name="oyk_auth_register"),
    path("login/", OykLoginView.as_view(), name="oyk_auth_login"),
    path("logout/", OykLogoutView.as_view(), name="oyk_auth_logout"),

    path("me/", OykMeView.as_view(), name="oyk_auth_me"),
]
