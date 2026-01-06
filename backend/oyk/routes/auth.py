import jwt
import bcrypt
from datetime import datetime, timedelta
from flask import request, jsonify, current_app, g

from oyk.decorators import require_auth, require_dev
from oyk.extensions import db
from oyk.models.user import User
from oyk.models.character import Character
from oyk.routes import auth_bp
from oyk.utils import get_abbr, get_slug


def get_jwt_secret_key():
    """Get the JWT secret key from Flask config."""
    return current_app.config["JWT_SECRET_KEY"]


def generate_jwt_token(user_id):
    """Generate a JWT token for the user."""
    payload = {
        "user_id": user_id,
        "exp": datetime.now() + timedelta(hours=24),
        "iat": datetime.now(),
    }

    secret_key = get_jwt_secret_key()
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token


def verify_jwt_token(token):
    """Verify and decode a JWT token."""
    try:
        secret_key = get_jwt_secret_key()
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Invalid token"}), 401


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user with hashed password."""
    try:
        data = request.get_json()

        if not data:
            return (
                jsonify({"success": False, "message": "No data provided"}),
                400,
            )

        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        playername = data.get("playername")

        if not all([email, username, password, playername]):
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Please fill in all fields",
                        "fields": {
                            "username": ("Username is required" if not username else None),
                            "password": ("Password is required" if not password else None),
                            "email": ("Email is required" if not email else None),
                            "playername": ("Playername is required" if not playername else None),
                        },
                    }
                ),
                400,
            )

        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == email) | (User.username == username) | (User.playername == playername)
        ).first()

        if existing_user:
            return (
                jsonify(
                    {
                        "success": False,
                        "fields": {
                            "username": (
                                "User with this username already exists"
                                if existing_user.username == username
                                else None
                            ),
                            "email": (
                                "User with this email already exists"
                                if existing_user.email == email
                                else None
                            ),
                            "playername": (
                                "User with this playername already exists"
                                if existing_user.playername == playername
                                else None
                            ),
                        },
                    }
                ),
                400,
            )

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        # Create new user
        user = User(
            email=email,
            username=username,
            password=hashed_password.decode("utf-8"),
            playername=playername,
            abbr=get_abbr(playername),
            is_abbr_auto=True,
            slug=get_slug(playername, None, User),
            is_slug_auto=True,
        )

        # Save user to database
        user.save()

        # Generate JWT token
        token = generate_jwt_token(user.id)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Registration successful",
                    "token": token,
                    "user": user.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        print(e)
        return (
            jsonify({"success": False, "message": "Internal server error"}),
            500,
        )


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login route that validates credentials and returns a JWT token."""
    try:
        data = request.get_json()

        if not data:
            return (
                jsonify({"success": False, "message": "No data provided"}),
                400,
            )

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return (
                jsonify(
                    {
                        "success": False,
                        "fields": {
                            "username": ("Username is required" if not username else None),
                            "password": ("Password is required" if not password else None),
                        },
                    }
                ),
                400,
            )

        # Find user by username
        user = User.query.filter_by(username=username).first()

        if not user:
            return (
                jsonify(
                    {
                        "success": False,
                        "fields": {
                            "username": "Invalid username or password",
                            "password": "Invalid username or password",
                        },
                    }
                ),
                401,
            )

        # Check if user is active
        if not user.is_active:
            return (
                jsonify({"success": False, "message": "Account is deactivated"}),
                401,
            )

        # Verify password
        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return (
                jsonify(
                    {
                        "success": False,
                        "fields": {
                            "username": "Invalid username or password",
                            "password": "Invalid username or password",
                        },
                    }
                ),
                401,
            )

        # Generate JWT token
        token = generate_jwt_token(user.id)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Login successful",
                    "token": token,
                    "user": user.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        print(e)
        return (
            jsonify({"success": False, "message": "Internal server error"}),
            500,
        )


@auth_bp.route("/logout", methods=["POST"])
@require_auth
def logout():
    """Logout the current user."""
    return jsonify({"success": True, "message": "Logout successful"}), 200


@auth_bp.route("/me", methods=["GET"])
@require_auth
def me():
    """Get the current user's information."""
    return jsonify({"success": True, "user": g.current_user.to_dict()}), 200


@auth_bp.route("/verify", methods=["POST"])
def verify_token():
    """Verify a JWT token and return user information."""
    try:
        data = request.get_json()

        if not data:
            return (
                jsonify({"success": False, "message": "No data provided"}),
                400,
            )

        token = data.get("token")

        if not token:
            return (
                jsonify({"success": False, "message": "Token is required"}),
                400,
            )

        # Verify token
        payload = verify_jwt_token(token)
        user_id = payload.get("user_id")

        # Get user from database
        user = User.query.get(user_id)

        if not user or not user.is_active:
            return (
                jsonify({"success": False, "message": "Invalid or inactive user"}),
                401,
            )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Token is valid",
                    "user": user.to_dict(),
                }
            ),
            200,
        )
    except Exception:
        return (
            jsonify({"success": False, "message": "Internal server error"}),
            500,
        )


@auth_bp.route("/dev-clean", methods=["GET"])
@require_dev
def auth_clean():
    """Clean up the auth database for development purposes."""
    try:
        # Delete all characters first to avoid foreign key constraint issues
        Character.query.delete()
        db.session.commit()

        # Then delete all users
        User.query.delete()
        db.session.commit()

        return (
            jsonify({"success": True, "message": "Auth database cleaned"}),
            200,
        )
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"{e}"}),
            500,
        )
