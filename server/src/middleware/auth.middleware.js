import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (request, _response, next) => {
  const bearer = request.headers.authorization?.startsWith("Bearer ")
    ? request.headers.authorization.slice(7)
    : null;
  const token = request.cookies?.token || bearer;

  if (!token) {
    const error = new Error("Authentification requise");
    error.status = 401;
    throw error;
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== "object" || typeof payload.userId !== "string") {
      const error = new Error("Jeton invalide");
      error.status = 401;
      throw error;
    }
    request.user = { id: payload.userId };
    next();
  } catch (error) {
    if (error.status) throw error;
    const unauthorized = new Error("Jeton invalide ou expiré");
    unauthorized.status = 401;
    throw unauthorized;
  }
});
