import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, enum: ["film", "series", "anime"], index: true },
    description: { type: String, required: true, maxlength: 3000 },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, default: "" },
    trailerUrl: { type: String, default: "" },
    streamUrl: { type: String, default: "" },
    genres: { type: [String], default: [], index: true },
    releaseYear: { type: Number, min: 1888, max: 2100 },
    rating: { type: Number, min: 0, max: 10, default: 0, index: true },
    cast: { type: [String], default: [] },
    durationMinutes: { type: Number, min: 0 },
    isPublished: { type: Boolean, default: false, index: true },
    tmdbId: { type: Number, sparse: true, unique: true },
  },
  { timestamps: true },
);

mediaSchema.index({ title: "text", description: "text", genres: "text" });

export default mongoose.model("Media", mediaSchema);
