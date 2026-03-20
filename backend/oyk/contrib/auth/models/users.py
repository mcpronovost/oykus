from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone as tz
from django.utils.translation import gettext_lazy as _

from oyk.core.fields import OykImageField
from oyk.core.utils import get_abbr, get_slug
from oyk.core.validators import oyk_image_size_validator


class OykUserManager(BaseUserManager):
    """
    Custom manager for OykUser.
    Login is handled via username + password.
    """

    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError("The username field is required.")
        if not email:
            raise ValueError("The email field is required.")

        email = self.normalize_email(email)
        username = username.strip()

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_banned", False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_banned", False)
        # PermissionsMixin fields
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(username, email, password, **extra_fields)


class OykUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model using username + password authentication.

    AbstractBaseUser provides:
        - password  (hashed, via set_password / check_password)
        - last_login
        - is_active (we redefine it below for full control)

    PermissionsMixin provides:
        - is_superuser, groups, user_permissions
    """

    # ------------------------------------------------------------------
    # Core auth fields
    # ------------------------------------------------------------------
    username = models.CharField(
        verbose_name=_("Username"),
        max_length=50,
        unique=True,
    )
    email = models.EmailField(
        verbose_name=_("Courriel"),
        max_length=120,
        unique=True,
    )
    # `password` is inherited from AbstractBaseUser (hashed storage).

    # ------------------------------------------------------------------
    # Identity / display
    # ------------------------------------------------------------------
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

    # ------------------------------------------------------------------
    # Media
    # ------------------------------------------------------------------
    avatar = OykImageField(
        verbose_name=_("Avatar"),
        upload_to="a/u/a",
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
        upload_to="a/u/c",
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

    # ------------------------------------------------------------------
    # Preferences
    # ------------------------------------------------------------------
    timezone = models.CharField(
        verbose_name=_("Timezone"),
        max_length=64,
        default="UTC",
    )

    # ------------------------------------------------------------------
    # Meta / profile
    # ------------------------------------------------------------------
    meta_bio = models.TextField(null=True, blank=True)
    meta_birthday = models.DateField(null=True, blank=True)
    meta_country = models.CharField(max_length=64, null=True, blank=True)
    meta_job = models.CharField(max_length=128, null=True, blank=True)
    meta_mood = models.CharField(max_length=64, null=True, blank=True)
    meta_website = models.URLField(max_length=255, null=True, blank=True)
    meta_socials = models.JSONField(null=True, blank=True)

    # ------------------------------------------------------------------
    # Status flags
    # ------------------------------------------------------------------
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_banned = models.BooleanField(default=False)

    # ------------------------------------------------------------------
    # Ban / lock / failed-login tracking
    # ------------------------------------------------------------------
    banned_until = models.DateTimeField(null=True, blank=True)
    banned_reason = models.TextField(null=True, blank=True)
    locked_until = models.DateTimeField(null=True, blank=True)
    failedlogin_at = models.DateTimeField(null=True, blank=True)
    failedlogin_count = models.PositiveSmallIntegerField(default=0)

    # ------------------------------------------------------------------
    # Activity tracking
    # ------------------------------------------------------------------
    lastlogin_at = models.DateTimeField(null=True, blank=True)
    lastlogin_ip = models.GenericIPAddressField(
        protocol="both", unpack_ipv4=True, null=True, blank=True
    )
    lastlive_at = models.DateTimeField(null=True, blank=True)
    lastlive_ip = models.GenericIPAddressField(
        protocol="both", unpack_ipv4=True, null=True, blank=True
    )

    # ------------------------------------------------------------------
    # Timestamps
    # ------------------------------------------------------------------
    created_at = models.DateTimeField(default=tz.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    # ------------------------------------------------------------------
    # Manager
    # ------------------------------------------------------------------
    objects = OykUserManager()

    # ------------------------------------------------------------------
    # AbstractBaseUser config
    # ------------------------------------------------------------------
    USERNAME_FIELD = "username"  # login field
    REQUIRED_FIELDS = ["email", "name"]  # required by createsuperuser

    class Meta:
        db_table = "oyk_auth_users"
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["-created_at"]

    # ------------------------------------------------------------------
    # Save
    # ------------------------------------------------------------------
    def save(self, *args, **kwargs):
        if self.is_abbr_auto:
            self.abbr = get_abbr(self.name)
        if self.is_slug_auto:
            self.slug = get_slug(self.name, self, OykUser)
        super().save(*args, **kwargs)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def __str__(self) -> str:
        return self.username

    def get_full_name(self) -> str:
        return self.name

    def get_short_name(self) -> str:
        return self.abbr or self.username

    # -- Ban helpers ---------------------------------------------------

    def is_currently_banned(self) -> bool:
        """True if the user is banned and the ban has not expired."""
        if not self.is_banned:
            return False
        if self.banned_until is None:
            return True  # permanent ban
        return tz.now() < self.banned_until

    def is_currently_locked(self) -> bool:
        """True if the account is temporarily locked out."""
        if self.locked_until is None:
            return False
        return tz.now() < self.locked_until

    def record_failed_login(self) -> None:
        """Increment the failed-login counter and timestamp."""
        self.failedlogin_count += 1
        self.failedlogin_at = tz.now()
        self.save(update_fields=["failedlogin_count", "failedlogin_at"])

    def reset_failed_login(self) -> None:
        """Clear failed-login tracking after a successful login."""
        self.failedlogin_count = 0
        self.failedlogin_at = None
        self.save(update_fields=["failedlogin_count", "failedlogin_at"])

    def record_login(self, ip: str | None = None) -> None:
        """Update last-login timestamp and IP."""
        self.lastlogin_at = tz.now()
        self.lastlogin_ip = ip
        self.save(update_fields=["lastlogin_at", "lastlogin_ip"])

    def record_live(self, ip: str | None = None) -> None:
        """Update last-seen / last-live timestamp and IP."""
        self.lastlive_at = tz.now()
        self.lastlive_ip = ip
        self.save(update_fields=["lastlive_at", "lastlive_ip"])

    # -- Serializers ---------------------------------------------------

    def get_me_data(self) -> dict:
        return {
            "id": self.pk,
            "name": self.name,
            "abbr": self.abbr,
            "slug": self.slug,
            "avatar": self.avatar.url if self.avatar else None,
            "cover": self.cover.url if self.cover else None,
        }
