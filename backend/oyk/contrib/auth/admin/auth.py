from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from oyk.contrib.auth.models import OykUser


@admin.register(OykUser)
class OykUserAdmin(UserAdmin):
    list_display = ("name", "email", "lastlive_at", "is_active")
    list_filter = ("is_active",)
    filter_horizontal = ("groups", "user_permissions")
    search_fields = ("username", "name", "email")
    readonly_fields = (
        "lastlogin_at",
        "lastlogin_ip",
        "lastlive_at",
        "lastlive_ip",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (_("Authentication"), {"fields": ("username", "email", "password")}),
        (
            _("Identity"),
            {
                "fields": (
                    "name",
                    ("abbr", "is_abbr_auto"),
                    ("slug", "is_slug_auto"),
                )
            },
        ),
        (
            _("Media"),
            {
                "fields": (
                    "avatar",
                    "cover",
                )
            },
        ),
        (_("Preferences"), {"fields": ("timezone",)}),
        (
            _("Metadata"),
            {
                "fields": (
                    "meta_bio",
                    "meta_birthday",
                    "meta_country",
                    "meta_job",
                    "meta_mood",
                    "meta_website",
                    "meta_socials",
                )
            },
        ),
        (
            _("Status"),
            {
                "fields": (
                    "is_superuser",
                    "is_active",
                    "is_banned",
                )
            },
        ),
        (
            _("Security"),
            {
                "fields": (
                    "banned_until",
                    "banned_reason",
                    "locked_until",
                    "failedlogin_at",
                    "failedlogin_count",
                )
            },
        ),
        (
            _("Tracking"),
            {
                "fields": (
                    "lastlogin_at",
                    "lastlogin_ip",
                    "lastlive_at",
                    "lastlive_ip",
                )
            },
        ),
        (
            _("Important dates"),
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )


admin.site.unregister(Group)
