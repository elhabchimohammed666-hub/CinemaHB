import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

function issueToken(user, response) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  response.cookie("token", token, cookieOptions());
}

export const register = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body ?? {};
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    const error = new Error("Nom, adresse e-mail et mot de passe sont obligatoires.");
    error.status = 400;
    throw error;
  }
  if (!name.trim() || name.trim().length > 80) {
    const error = new Error("Le nom doit contenir entre 1 et 80 caractères.");
    error.status = 400;
    throw error;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    const error = new Error("Veuillez fournir une adresse e-mail valide.");
    error.status = 400;
    throw error;
  }
  if (password.length < 8 || password.length > 72) {
    const error = new Error("Le mot de passe doit contenir entre 8 et 72 caractères.");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() }).select("_id");
  if (existingUser) {
    const error = new Error("Un compte utilise déjà cette adresse e-mail.");
    error.status = 409;
    throw error;
  }

  const user = await User.create({ name: name.trim(), email, password });
  issueToken(user, response);
  response.status(201).json({ user: user.toJSON() });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    const error = new Error("Adresse e-mail et mot de passe sont obligatoires.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Adresse e-mail ou mot de passe incorrect.");
    error.status = 401;
    throw error;
  }

  issueToken(user, response);
  response.json({ user: user.toJSON() });
});

export const logout = (_request, response) => {
  response.clearCookie("token", cookieOptions());
  response.status(204).end();
};
