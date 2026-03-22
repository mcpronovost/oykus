from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from oyk.core.enums import OykRolesEnum

OykUser = get_user_model()


class OykRoleQuerySet(models.QuerySet):
    def staff(self, universe_slug):
        roles = (
            self.filter(
                universe__slug=universe_slug,
                role__in=[
                    OykRolesEnum.OWNER,
                    OykRolesEnum.ADMIN,
                    OykRolesEnum.MODO,
                ],
            )
            .select_related("user")
            .values("role", "user__id", "user__name")
        )

        result = {"owner": None, "admins": [], "modos": []}
        for r in roles:
            member = {
                "id": r["user__id"],
                "name": r["user__name"],
            }
            if r["role"] == OykRolesEnum.OWNER:
                result["owner"] = member
            elif r["role"] == OykRolesEnum.ADMIN:
                result["admins"].append(member)
            elif r["role"] == OykRolesEnum.MODO:
                result["modos"].append(member)

        return result


class OykRole(models.Model):
    universe = models.ForeignKey(
        "oyk_world.OykUniverse",
        on_delete=models.CASCADE,
        related_name="roles",
        verbose_name=_("Universe"),
    )
    user = models.ForeignKey(
        OykUser,
        related_name="universe_roles",
        on_delete=models.CASCADE,
        verbose_name=_("User"),
    )
    role = models.PositiveSmallIntegerField(
        verbose_name=_("Role"),
        choices=OykRolesEnum.choices,
        default=OykRolesEnum.VISITOR,
    )
    created_at = models.DateTimeField(
        verbose_name=_("Created At"),
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        verbose_name=_("Updated At"),
        auto_now=True,
    )

    # ------------------------------------------------------------------
    # Manager
    # ------------------------------------------------------------------
    objects = OykRoleQuerySet.as_manager()

    class Meta:
        db_table = "oyk_world_roles"
        verbose_name = _("Role")
        verbose_name_plural = _("Roles")
        ordering = ["role"]
        constraints = [
            models.UniqueConstraint(
                fields=["universe", "user"],
                name="unique_role_per_universe",
            )
        ]

    def __str__(self):
        return f"{self.universe} — {self.user} - {self.get_role_display()}"

    # -------------------------------------------------------------------------
    # Helpers
    # -------------------------------------------------------------------------

    def set_role(self, role):
        """Set a new role for this user in this universe."""
        self.role = role
        self.save(update_fields=["role", "updated_at"])

    def has_role(self, role):
        """Check if the user has at least the given role level."""
        return self.role <= role

    @classmethod
    def get_role(cls, universe, user):
        """Return the role of a user in a universe, or None."""
        return cls.objects.filter(universe=universe, user=user).first()

    @classmethod
    def get_universe_members(cls, universe, min_role=OykRolesEnum.MEMBER):
        """Return all roles for a universe,
        filtered by minimum role level."""
        return cls.objects.filter(universe=universe, role__lte=min_role)

    @classmethod
    def get_user_universes(cls, user, min_role=OykRolesEnum.MEMBER):
        """Return all roles for a user across universes,
        filtered by minimum role level."""
        return cls.objects.filter(user=user, role__lte=min_role)
