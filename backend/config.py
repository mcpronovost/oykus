import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    FLASK_ENV = "production"
    DEBUG = False
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "jwt-secret-key"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Optimizations
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    }

    # Security headers
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"


class DevelopmentConfig(Config):
    FLASK_ENV = "development"
    DEBUG = os.environ.get("FLASK_DEBUG") == "1"
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL")
        or "mysql+pymysql://username:password@localhost/oykus_dev"
    )


class ProductionConfig(Config):
    FLASK_ENV = "production"
    DEBUG = os.environ.get("FLASK_DEBUG") == "1"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
