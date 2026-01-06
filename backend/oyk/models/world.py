from datetime import datetime

from oyk.extensions import db
from oyk.utils import get_abbr, get_slug


class World(db.Model):
    __tablename__ = "oyk_worlds"

    # Authentication
    id = db.Column(
        db.Integer,
        primary_key=True,
        index=True,
    )
    owner_id = db.Column(
        db.String(36),
        db.ForeignKey("oyk_users.id"),
        nullable=False,
    )
    owner = db.relationship(
        "User",
        back_populates="worlds",
        lazy="joined",
    )

    # World Identity
    name = db.Column(
        db.String(120),
        nullable=False,
    )
    abbr = db.Column(
        db.String(3),
        nullable=False,
    )
    is_abbr_auto = db.Column(db.Boolean, default=True)
    slug = db.Column(
        db.String(120),
        nullable=False,
        unique=True,
    )
    is_slug_auto = db.Column(db.Boolean, default=True)

    # Status
    is_active = db.Column(db.Boolean, default=True, index=True)
    is_public = db.Column(db.Boolean, default=False, index=True)

    # Relationships
    themes = db.relationship(
        "WorldTheme",
        back_populates="world",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    world_areas = db.relationship(
        "WorldArea",
        back_populates="world",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    world_sectors = db.relationship(
        "WorldSector",
        back_populates="world",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    tasks = db.relationship(
        "Task",
        back_populates="world",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    task_status = db.relationship(
        "TaskStatus",
        back_populates="world",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    # Important Dates
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        nullable=False,
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
    )

    def __repr__(self):
        return f"<World: {self.name}>"

    def __str__(self):
        return self.name

    def to_dict(self, include_owner=True):
        data = {
            "id": self.id,
            "name": self.name,
            "abbr": self.abbr,
            "slug": self.slug,
        }
        if include_owner:
            data["owner"] = self.owner.to_dict(include_worlds=False)
        active_theme = self.themes.filter_by(is_active=True).first()
        if active_theme:
            data["theme"] = active_theme.to_dict()
        return data

    def validate(self):
        if self.is_abbr_auto:
            self.abbr = get_abbr(self.name)
        else:
            if not self.abbr:
                raise ValueError("Abbreviation is required")
            if len(self.abbr) > 3:
                raise ValueError("Abbreviation must be 3 characters or less")
            if not self.abbr.isalpha() or not self.abbr.isupper():
                raise ValueError("Abbreviation must be uppercase letters")
        if self.is_slug_auto:
            self.slug = get_slug(self.name, self, World)
        else:
            if not self.slug:
                raise ValueError("Slug is required")

    def save(self):
        self.validate()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class WorldTheme(db.Model):
    __tablename__ = "oyk_world_themes"

    # Authentication
    id = db.Column(
        db.Integer,
        primary_key=True,
        index=True,
    )
    world_id = db.Column(
        db.Integer,
        db.ForeignKey("oyk_worlds.id"),
        nullable=False,
    )
    world = db.relationship(
        "World",
        back_populates="themes",
        lazy="joined",
    )

    # Theme Identity
    name = db.Column(
        db.String(64),
        nullable=False,
    )

    # Colours
    c_primary = db.Column(
        db.String(9),
        nullable=True,
    )
    c_primary_fg = db.Column(
        db.String(9),
        nullable=True,
    )

    # Status
    is_active = db.Column(db.Boolean, default=False, index=True)

    # Important Dates
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        nullable=False,
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
    )

    def __repr__(self):
        return f"<WorldTheme: {self.name}>"

    def __str__(self):
        return self.name

    def to_dict(self, include_full=False):
        data = {
            "c_primary": self.c_primary,
            "c_primary_fg": self.c_primary_fg,
        }
        if include_full:
            data.update(
                {
                    "id": self.id,
                    "name": self.name,
                }
            )
        return data

    def validate(self):
        """Validate that only one WorldTheme is active per World."""
        if self.is_active:
            # Check if there's another active theme for the same world
            existing_active = WorldTheme.query.filter(
                WorldTheme.world_id == self.world_id,
                WorldTheme.is_active.is_(True),
                WorldTheme.id != self.id,
            ).first()

            if existing_active:
                # Deactivate the existing active theme
                existing_active.is_active = False
                db.session.add(existing_active)

    def save(self):
        self.validate()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class WorldArea(db.Model):
    __tablename__ = "oyk_world_areas"

    # Authentication
    id = db.Column(
        db.Integer,
        primary_key=True,
        index=True,
    )
    world_id = db.Column(
        db.Integer,
        db.ForeignKey("oyk_worlds.id"),
        nullable=False,
    )
    world = db.relationship(
        "World",
        back_populates="world_areas",
        lazy="joined",
    )

    # Area Identity
    name = db.Column(
        db.String(64),
        nullable=False,
    )
    sort_order = db.Column(
        db.Integer,
        nullable=False,
        default=0,
    )

    # Relationships
    world_sectors = db.relationship(
        "WorldSector",
        back_populates="world_area",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    # Important Dates
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        nullable=False,
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
    )

    def __repr__(self):
        return f"<WorldArea: {self.name}>"

    def __str__(self):
        return self.name

    def to_dict(self, include_sectors=True):
        data = {
            "id": self.id,
            "name": self.name,
        }
        if include_sectors:
            data["sectors"] = [
                sector.to_dict(include_area=False)
                for sector in self.world_sectors.order_by(
                    WorldSector.sort_order
                )
            ]
        return data

    def validate(self):
        pass

    def save(self):
        self.validate()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class WorldSector(db.Model):
    __tablename__ = "oyk_world_sectors"

    # Authentication
    id = db.Column(
        db.Integer,
        primary_key=True,
        index=True,
    )
    world_id = db.Column(
        db.Integer,
        db.ForeignKey("oyk_worlds.id"),
        nullable=False,
    )
    world = db.relationship(
        "World",
        back_populates="world_sectors",
        lazy="joined",
    )
    world_area_id = db.Column(
        db.Integer,
        db.ForeignKey("oyk_world_areas.id"),
        nullable=False,
    )
    world_area = db.relationship(
        "WorldArea",
        back_populates="world_sectors",
        lazy="joined",
    )

    # Sector Identity
    name = db.Column(
        db.String(64),
        nullable=False,
    )
    sort_order = db.Column(
        db.Integer,
        nullable=False,
        default=0,
    )

    # Important Dates
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        nullable=False,
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
    )

    def __repr__(self):
        return f"<WorldSector: {self.name}>"

    def __str__(self):
        return self.name

    def to_dict(self, include_area=True):
        data = {
            "id": self.id,
            "name": self.name,
        }
        if include_area:
            data["area"] = self.world_area.to_dict(include_sectors=False)
        return data

    def validate(self):
        pass

    def save(self):
        self.validate()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
