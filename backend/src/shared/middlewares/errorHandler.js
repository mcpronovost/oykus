import { ApiError } from "../errors/index.js";

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  // Errors raised by Express itself (bad JSON, payload too large) carry a 4xx status
  const status = error.statusCode ?? error.status;
  if (status >= 400 && status < 500) {
    res.status(status).json(new ApiError(error.message, status).toJSON());
    return;
  }

  console.error(error);

  const fallback = new ApiError(
    "An unexpected error occurred",
    500,
    "Internal server error",
  );
  res.status(fallback.statusCode).json(fallback.toJSON());
}

export default errorHandler;
