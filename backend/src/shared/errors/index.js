export class OykError extends Error {
  constructor(code, message, statusCode = 500, fields = undefined) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
  }

  toJSON() {
    const error = {
      code: this.code,
      message: this.message,
    };

    if (this.fields) {
      error.fields = this.fields;
    }

    return { error };
  }
}

export class BadRequestError extends OykError {
  constructor(message = "Bad request", fields) {
    super("bad_request", message, 400, fields);
  }
}

export class UnauthorizedError extends OykError {
  constructor(message = "Unauthorized") {
    super("unauthorized", message, 401);
  }
}

export class ForbiddenError extends OykError {
  constructor(message = "Forbidden") {
    super("forbidden", message, 403);
  }
}

export class NotFoundError extends OykError {
  constructor(message = "Not found") {
    super("not_found", message, 404);
  }
}

export class ConflictError extends OykError {
  constructor(message = "Conflict") {
    super("conflict", message, 409);
  }
}

export class TooManyRequestsError extends OykError {
  constructor(message = "Too many requests") {
    super("too_many_requests", message, 429);
  }
}
