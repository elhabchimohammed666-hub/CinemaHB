import Media from "../models/Media.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const categories = new Set(["film", "series", "anime"]);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getMediaByCategory = asyncHandler(async (request, response) => {
  const { category } = request.params;
  if (!categories.has(category)) {
    const error = new Error("Catégorie invalide. Valeurs autorisées : film, series, anime.");
    error.status = 400;
    throw error;
  }

  const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
  const limit = Math.min(40, Math.max(1, Number.parseInt(request.query.limit, 10) || 12));
  const filter = { category, isPublished: true };

  if (request.query.genre) {
    filter.genres = new RegExp(`^${escapeRegex(String(request.query.genre).slice(0, 50))}$`, "i");
  }
  if (request.query.year) {
    const year = Number.parseInt(request.query.year, 10);
    if (!Number.isInteger(year) || year < 1888 || year > 2100) {
      const error = new Error("L’année doit être comprise entre 1888 et 2100.");
      error.status = 400;
      throw error;
    }
    filter.releaseYear = year;
  }

  const [media, total] = await Promise.all([
    Media.find(filter)
      .select("-streamUrl")
      .sort({ rating: -1, releaseYear: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Media.countDocuments(filter),
  ]);

  response.json({
    data: media,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
