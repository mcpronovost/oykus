from flask import jsonify

from oyk.decorators import require_auth, require_dev
from oyk.extensions import db
from oyk.routes import world_bp
from oyk.models.user import User
from oyk.models.task import TaskStatus, Task
from oyk.models.world import World, WorldTheme, WorldArea, WorldSector


@world_bp.route("/<world_slug>", methods=["GET"])
@require_auth
def world_get(world_slug):
    """Get a world."""
    world = World.query.filter_by(slug=world_slug).first()
    if not world:
        return jsonify({"success": False, "message": "World not found"}), 404
    try:
        areas = world.world_areas.order_by(WorldArea.sort_order).all()
        world = world.to_dict()
        world["areas"] = [area.to_dict() for area in areas]
        return (
            jsonify(
                {
                    "success": True,
                    "world": world,
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"{e}"}),
            500,
        )


@world_bp.route("/dev-create", methods=["GET"])
@require_dev
def worlds_dev_create():
    """Create a test world for development purposes."""
    try:
        user = User.query.first()
        world = World(
            owner_id=user.id,
            name="Qalatlán",
            abbr="Q",
            is_abbr_auto=True,
            slug="qalatan",
            is_slug_auto=True,
        )
        world.validate()
        world.save()
        world_area = WorldArea(
            world_id=world.id,
            name="Area #1",
            sort_order=0,
        )
        world_area.validate()
        world_area.save()
        world_sector = WorldSector(
            world_id=world.id,
            world_area_id=world_area.id,
            name="Sector #1",
            sort_order=0,
        )
        world_sector.validate()
        world_sector.save()
        theme = WorldTheme(
            world_id=world.id,
            name="Default Qalatlán",
            c_primary="#3da5cb",
            c_primary_fg="#ffffff",
            is_active=True,
        )
        theme.validate()
        theme.save()
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Test world created",
                    "world": world.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return (
            jsonify({"success": False, "message": f"{e}"}),
            500,
        )


@world_bp.route("/dev-update", methods=["GET"])
@require_dev
def worlds_dev_update():
    """Update a test world for development purposes."""
    try:
        world = World.query.first()
        worldTheme = WorldTheme.query.filter_by(world_id=world.id).first()
        worldTheme.c_primary = "#227990"
        worldTheme.c_primary_fg = "#ffffff"
        worldTheme.is_active = True
        worldTheme.validate()
        worldTheme.save()
        world.validate()
        world.save()
        return (
            jsonify({"success": True, "message": "Test world updated"}),
            200,
        )
    except Exception as e:
        print(e)
        return (
            jsonify({"success": False, "message": f"{e}"}),
            500,
        )


@world_bp.route("/dev-clean", methods=["GET"])
@require_dev
def worlds_clean():
    """Clean up the worlds database for development purposes."""
    try:
        Task.query.delete()
        TaskStatus.query.delete()
        WorldSector.query.delete()
        WorldArea.query.delete()
        WorldTheme.query.delete()
        World.query.delete()
        db.session.commit()
        return (
            jsonify({"success": True, "message": "Worlds database cleaned"}),
            200,
        )
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"{e}"}),
            500,
        )
