export function notFound(request, _response, next) {
  const error = new Error(`Route introuvable : ${request.method} ${request.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _request, response, _next) {
  let status = error.status || error.statusCode || 500;
  let message = error.message;
  if (error.code === 11000) {
    status = 409;
    message = "Cette valeur existe déjà.";
  } else if (error.name === "ValidationError" || error.name === "CastError") {
    status = 400;
  }
  if (status >= 500) console.error(error);
  response.status(status).json({
    message: status >= 500 ? "Une erreur serveur est survenue" : message,
  });
}
