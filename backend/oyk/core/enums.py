from django.db import models
from django.utils.translation import gettext_lazy as _


class OykRolesEnum(models.IntegerChoices):
    """User roles"""
    OWNER = 1, _("Owner")
    ADMIN = 2, _("Administrator")
    MODO = 3, _("Moderator")
    MEMBER = 4, _("Member")
    VISITOR = 5, _("Visitor")
    PUBLIC = 6, _("Public")


class OykVisibilityEnum(models.IntegerChoices):
    """Visibility levels (higher = more open)."""
    OWNER = 1, _("Owner")
    ADMINS = 2, _("Administrators")
    MODOS = 3, _("Moderators")
    MEMBERS = 4, _("Members")
    VISITORS = 5, _("Visitors")
    PUBLIC = 6, _("Public")
