from django.urls import path

from .views import (
    OykUniversesListView,
    OykUniverseView,
    OykUniverseCommunityView,
)


urlpatterns = [
    path("universes/", OykUniversesListView.as_view()),
    path("universes/<slug:slug>/", OykUniverseView.as_view()),
    path("universes/<slug:slug>/community/", OykUniverseCommunityView.as_view()),
]
