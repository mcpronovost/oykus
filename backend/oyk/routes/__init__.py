"""
Routes module for the Oykus Flask application.

This module contains all the route blueprints and their endpoints.

Available Routes:

Authentication Routes (/api/auth):
    POST /api/auth/register         - Register a new user
    POST /api/auth/login            - Login user
    POST /api/auth/logout           - Logout user (requires auth)
    GET  /api/auth/me               - Get current user info (requires auth)
    POST /api/auth/verify           - Verify JWT token

    GET  /api/auth/dev-clean        - Clean auth database (dev only)

Player Routes (/api/player):
    GET  /api/player/<player_slug>  - Get player information (requires auth)

Character Routes (/api/character):
    GET  /api/character/dev-create  - Create test character (dev only)
    GET  /api/character/dev-clean   - Clean characters database (dev only)

World Routes (/api/world):
    GET   /api/world/<world_slug>

    GET   /api/world/dev-create     - Create test world (dev only)
    GET   /api/world/dev-update     - Update test world (dev only)
    GET   /api/world/dev-clean      - Clean worlds database (dev only)

World Task Routes (/api/world/task):
    GET   /api/world/<world_slug>/tasks
    POST  /api/world/<world_slug>/task-status/create
    PATCH /api/world/<world_slug>/task-status/<status_id>/edit

Health Routes (/api/health):
    GET  /api/health/               - Health check endpoint (dev only)

Total: 13 routes
"""

from flask import Blueprint

# Create blueprints
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
player_bp = Blueprint("player", __name__, url_prefix="/api/player")
character_bp = Blueprint("character", __name__, url_prefix="/api/character")
world_bp = Blueprint("world", __name__, url_prefix="/api/world")
world_task_bp = Blueprint("world_task", __name__, url_prefix="/api/world")
health_bp = Blueprint("health", __name__, url_prefix="/api/health")

# Import route modules
from . import auth
from . import player
from . import character
from . import world
from . import world_task
from . import health
