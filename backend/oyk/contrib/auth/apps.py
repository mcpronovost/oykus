from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class OykAuthConfig(AppConfig):
    name = "oyk.contrib.auth"
    label = "oyk_auth"
    verbose_name = _("Authentication")
