import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    avatar: { type: String, default: "" },
    isKids: { type: Boolean, default: false },
  },
  { _id: true },
);

const watchHistorySchema = new mongoose.Schema(
  {
    media: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
    progressSeconds: { type: Number, min: 0, default: 0 },
    durationSeconds: { type: Number, min: 0, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profiles: {
      type: [profileSchema],
      default: function defaultProfiles() {
        return [{ name: this.name }];
      },
      validate: {
        validator: (profiles) => profiles.length <= 5,
        message: "An account can have at most five profiles",
      },
    },
    watchHistory: { type: [watchHistorySchema], default: [] },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set("toJSON", {
  transform(_document, result) {
    delete result.password;
    delete result.__v;
    return result;
  },
});

export default mongoose.model("User", userSchema);
