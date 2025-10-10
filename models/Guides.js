const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GuidesSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    avatar: { type: String, required: true },
    coverImage: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, default: 0 },
    experienceYears: { type: Number, required: true },
    totalTours: { type: Number, required: true },
    languages: { type: [String], required: true },  
    specialties: [String],
    location: String,
    joinedDate: { type: String, required: true },
    verified: { type: Boolean, default: false },
    description: { type: String, required: true },
    achievements: [String],
    upcomingTours: [{ type: Schema.Types.ObjectId, ref: "UpComing" }],
  },
  {
    timestamps: true,
  }
);

const GuidesModel = model("Guides", GuidesSchema);

module.exports = GuidesModel;
