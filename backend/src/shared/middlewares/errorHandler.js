import { OykError } from "../errors/index.js";

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof OykError) {
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  const status = error.statusCode ?? error.status;
  if (status >= 400 && status < 500) {
    res.status(status).json(new OykError("bad_request", error.message, status).toJSON());
    return;
  }

  console.error(error);

  const fallback = new OykError("internal_error", "An unexpected error occurred", 500);
  res.status(fallback.statusCode).json(fallback.toJSON());
}

export default errorHandler;
