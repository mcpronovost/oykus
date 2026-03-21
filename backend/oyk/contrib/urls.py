from django.urls import path, include

urlpatterns = [
    path("auth/", include("oyk.contrib.auth.urls")),
    path("world/", include("oyk.contrib.world.urls")),
    # path("blog/", include("oyk.contrib.blog.urls")),
]
