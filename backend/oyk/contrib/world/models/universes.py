from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from django.db import models
from django.db.models import F, OuterRef, Q, Subquery, Value
from django.db.models.functions import Coalesce
from django.utils.translation import gettext_lazy as _

from oyk.core.enums import OykRolesEnum, OykVisibilityEnum
from oyk.core.fields import OykImageField
from oyk.core.utils import get_abbr, get_slug
from oyk.core.validators import oyk_image_size_validator

from .themes import OykTheme
from .roles import OykRole

OykUser = get_user_model()


class OykUniverseQuerySet(models.QuerySet):
    SHORT_FIELDS = (
        "id",
        "name",
        "abbr",
        "slug",
        "logo",
        "cover",
    )
    PUBLIC_FIELDS = (
        "id",
        "name",
        "abbr",
        "slug",
        "logo",
        "cover",
        "created_at",
        "updated_at",
    )

    def _with_media_urls(self, qs_values):
        return [
            {
                **u,
                "logo": (
                    f"{settings.MEDIA_URL}{u['logo']}" if u["logo"] else None
                ),
                "cover": (
                    f"{settings.MEDIA_URL}{u['cover']}" if u["cover"] else None
                ),
            }
            for u in qs_values
        ]

    def visible_to(self, user):
        """Filter universes the user has permission to see."""
        if not user or not user.is_authenticated:
            # Unauthenticated users: only PUBLIC universes (no role needed)
            return self.filter(visibility=OykVisibilityEnum.PUBLIC)

        # User's role for each universe (None if no role exists)
        user_role = OykRole.objects.filter(
            universe=OuterRef("pk"),
            user=user,
        ).values("role")[:1]

        return self.annotate(
            user_role=Coalesce(
                Subquery(user_role),
                Value(OykRolesEnum.VISITOR),
            )
        ).filter(
            # Either the universe visibility <= user's role
            Q(user_role__lte=F("visibility"))
            # Or the user is the owner (always sees their own)
            | Q(owner=user)
        )

    def short(self, user, slug=None):
        qs = self.visible_to(user)
        if slug:
            qs = qs.filter(is_active=True, slug=slug)
        r = self._with_media_urls(qs.values(*self.SHORT_FIELDS))
        return r

    def current(self, user, slug="oykus"):
        qs = self.visible_to(user)
        if slug:
            qs = qs.filter(is_active=True, slug=slug)
        results = self._with_media_urls(qs.values(*self.PUBLIC_FIELDS))
        if not results:
            return None
        r = results[0]
        if slug == "oykus":
            r["is_default"] = True
        r["staff"] = OykRole.objects.staff(slug)
        return r


class OykUniverse(models.Model):
    name = models.CharField(
        verbose_name=_("Name"),
        max_length=120,
        unique=True,
    )
    slug = models.SlugField(
        verbose_name=_("Slug"),
        max_length=120,
        unique=True,
    )
    is_slug_auto = models.BooleanField(
        verbose_name=_("Slug is auto"),
        default=True,
    )
    abbr = models.CharField(
        verbose_name=_("Abbreviation"),
        max_length=3,
    )
    is_abbr_auto = models.BooleanField(
        verbose_name=_("Abbreviation is auto"),
        default=True,
    )
    owner = models.ForeignKey(
        OykUser,
        related_name="universes",
        on_delete=models.CASCADE,
        verbose_name=_("Owner"),
    )
    # Media
    logo = OykImageField(
        verbose_name=_("Logo"),
        upload_to="w/u/l",
        max_width=200,
        max_height=200,
        blank=True,
        null=True,
        validators=[
            oyk_image_size_validator,
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            ),
        ],
    )
    cover = OykImageField(
        verbose_name=_("Cover"),
        upload_to="w/u/c",
        max_width=1200,
        max_height=256,
        blank=True,
        null=True,
        validators=[
            oyk_image_size_validator,
            FileExtensionValidator(
                allowed_extensions=["jpg", "jpeg", "png", "webp"]
            ),
        ],
    )
    # Statuses
    is_default = models.BooleanField(
        verbose_name=_("Is Default"),
        default=False,
    )
    is_active = models.BooleanField(
        verbose_name=_("Is Active"),
        default=True,
    )
    visibility = models.PositiveSmallIntegerField(
        verbose_name=_("Visibility"),
        choices=OykVisibilityEnum.choices,
        default=OykVisibilityEnum.OWNER,
    )
    # Mods
    is_mod_blog_active = models.BooleanField(
        verbose_name=_("Mod Blog Active"),
        default=False,
    )
    mod_blog_settings = models.JSONField(
        verbose_name=_("Mod Blog Settings"),
        blank=True,
        null=True,
    )
    is_mod_agenda_active = models.BooleanField(
        verbose_name=_("Mod Agenda Active"),
        default=False,
    )
    mod_agenda_settings = models.JSONField(
        verbose_name=_("Mod Agenda Settings"),
        blank=True,
        null=True,
    )
    # Important Dates
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
    objects = OykUniverseQuerySet.as_manager()

    class Meta:
        db_table = "oyk_world_universes"
        verbose_name = _("Universe")
        verbose_name_plural = _("Universes")
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["owner"]),
        ]

    def __str__(self):
        return self.name

    # ------------------------------------------------------------------
    # Save
    # ------------------------------------------------------------------
    def save(self, *args, **kwargs):
        if self.is_abbr_auto:
            self.abbr = get_abbr(self.name)
        if self.is_slug_auto:
            self.slug = get_slug(self.name, self, OykUniverse)
        super().save(*args, **kwargs)

    # -- Serializers ---------------------------------------------------

    def get_short_data(self):
        data = {
            "id": self.pk,
            "name": self.name,
            "abbr": self.abbr,
            "slug": self.slug,
            "logo": self.logo.url if self.logo else None,
            "cover": self.cover.url if self.cover else None,
            "created_at": self.created_at,
        }
        staff = {
            "owner": None,
            "admins": [],
            "modos": [],
        }
        data["staff"] = staff
        return data

    def get_staff(self):
        staff = {
            "owner": None,
            "admins": [],
            "modos": [],
        }

        # TODO: serialize staff members
        # owner = OykRole.get_universe_members(self, 3)

        return staff
