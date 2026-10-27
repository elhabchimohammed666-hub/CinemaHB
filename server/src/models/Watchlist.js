import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
  },
  { timestamps: true },
);

watchlistSchema.index({ user: 1, media: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);
