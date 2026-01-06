from flask import jsonify, request

from oyk.decorators import require_auth
from oyk.routes import world_task_bp
from oyk.models.world import World
from oyk.models.task import TaskStatus


@world_task_bp.route("/<world_slug>/tasks", methods=["GET"])
@require_auth
def world_tasks_get(world_slug):
    """Get all tasks for a world."""
    world = World.query.filter_by(slug=world_slug).first()
    if not world:
        return jsonify({"success": False, "message": "World not found"}), 404
    status = world.task_status.order_by(TaskStatus.sort_order.asc()).all()
    return (
        jsonify(
            {
                "success": True,
                "tasks": [status.to_dict() for status in status],
                "status": [
                    {
                        "label": status.name,
                        "value": status.id,
                    }
                    for status in status
                ],
            }
        ),
        200,
    )


@world_task_bp.route("/<world_slug>/task-status/<status_id>/edit", methods=["PATCH"])
@require_auth
def world_task_status_edit(world_slug, status_id):
    """Edit a task status for a world."""
    world = World.query.filter_by(slug=world_slug).first()
    if not world:
        return jsonify({"success": False, "message": "World not found"}), 404
    status = TaskStatus.query.filter_by(
        id=status_id, world_id=world.id
    ).first()
    if not status:
        return (
            jsonify({"success": False, "message": "Task status not found"}),
            404,
        )
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
    status.name = data["name"]
    status.colour = data["colour"]
    status.sort_order = data["sort_order"]
    status.validate()
    status.save()
    return (
        jsonify(
            {
                "success": True,
                "message": "Task status updated",
                "status": status.to_dict(),
            }
        ),
        200,
    )


@world_task_bp.route("/<world_slug>/task-status/create", methods=["POST"])
@require_auth
def world_task_status_create(world_slug):
    """Create a new task status for a world."""
    world = World.query.filter_by(slug=world_slug).first()
    if not world:
        return jsonify({"success": False, "message": "World not found"}), 404
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
    status = TaskStatus(
        world_id=world.id,
        name=data["name"],
        colour=data["colour"],
        sort_order=data["sort_order"],
    )
    status.validate()
    status.save()
    return (
        jsonify(
            {
                "success": True,
                "message": "Task status created",
                "status": status.to_dict(),
            }
        ),
        200,
    )
