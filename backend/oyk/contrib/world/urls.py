from django.urls import path

from .views import (
    OykUniversesListView,
    OykUniverseView,
)


urlpatterns = [
    path("universes/", OykUniversesListView.as_view()),
    path("universes/<slug:slug>/", OykUniverseView.as_view()),
]
