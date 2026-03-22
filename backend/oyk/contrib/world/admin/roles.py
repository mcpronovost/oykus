from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from oyk.contrib.world.models import OykRole


@admin.register(OykRole)
class OykRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "universe", "role")
    list_filter = ("role",)
    readonly_fields = ("created_at", "updated_at")
