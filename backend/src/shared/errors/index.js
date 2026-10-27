export class OykError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }

  toJSON() {
    return { ok: false, error: this.message };
  }
}

export class BadRequestError extends OykError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends OykError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends OykError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends OykError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ConflictError extends OykError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

// Example usage:
// throw new NotFoundError("Space not found");
// throw new ForbiddenError("Space limit reached");
