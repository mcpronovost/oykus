from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class OykWorldConfig(AppConfig):
    name = "oyk.contrib.world"
    label = "oyk_world"
    verbose_name = _("World")
