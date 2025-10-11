const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GuideSchema = new Schema({
  name: { type: String, required: true },
  experience: { type: String },
  languages: [String],
});

const TourSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    difficulty: { type: String },
    price: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    images: [String],
    itinerary: [String],
    includes: [String],
    guide: GuideSchema,
    location: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const TourModel = model("Tour", TourSchema);

module.exports = TourModel;
