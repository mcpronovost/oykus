from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from .universes import OykUniverse


class OykTheme(models.Model):
    universe = models.ForeignKey(
        OykUniverse,
        on_delete=models.CASCADE,
        related_name="themes",
        verbose_name=_("Universe"),
    )
    name = models.CharField(
        verbose_name=_("Name"),
        max_length=120,
    )
    c_primary = models.CharField(
        verbose_name=_("Primary Colour"),
        max_length=7,
    )
    c_primary_fg = models.CharField(
        verbose_name=_("Foreground Primary Colour"),
        max_length=7,
    )
    variables = models.JSONField(
        verbose_name=_("Variables"),
    )
    stylesheet = models.TextField(
        verbose_name=_("Stylesheet"),
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(
        verbose_name=_("Is Active"),
        default=False,
    )
    created_at = models.DateTimeField(
        verbose_name=_("Created At"),
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        verbose_name=_("Updated At"),
        auto_now=True,
    )

    class Meta:
        db_table = "oyk_world_themes"
        verbose_name = _("Theme")
        verbose_name_plural = _("Themes")
        indexes = [
            models.Index(fields=["universe"]),
            models.Index(fields=["universe", "is_active"]),
        ]

    def __str__(self):
        return f"{self.universe} — {self.name}"

    # -------------------------------------------------------------------------
    # Helpers
    # -------------------------------------------------------------------------

    def activate(self):
        """Set this theme as the active one, deactivating all others."""
        OykTheme.objects.filter(
            universe=self.universe,
            is_active=True,
        ).update(is_active=False)
        self.is_active = True
        self.save(update_fields=["is_active", "updated_at"])

    def deactivate(self):
        """Deactivate this theme."""
        self.is_active = False
        self.save(update_fields=["is_active", "updated_at"])

    @classmethod
    def get_active(cls, universe):
        """Return the active theme for a given universe, or None."""
        return cls.objects.filter(
            universe=universe,
            is_active=True,
        ).first()
