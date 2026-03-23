from django.urls import path

from .views import (
    OykRegisterView,
    OykLoginView,
    OykLogoutView,
    OykMeView,
    OykUserProfileView,
)


urlpatterns = [
    path("register/", OykRegisterView.as_view()),
    path("login/", OykLoginView.as_view()),
    path("logout/", OykLogoutView.as_view()),
    path("me/", OykMeView.as_view()),
    path("users/<slug:slug>/profile/", OykUserProfileView.as_view()),
]
