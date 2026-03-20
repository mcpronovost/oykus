from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class OykCoreConfig(AppConfig):
    name = "oyk.core"
    label = "oyk_core"
    verbose_name = _("Core")
