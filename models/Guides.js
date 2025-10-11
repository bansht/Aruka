const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ContactSchema = new Schema({
  phone: { type: String },
  email: { type: String },
  website: { type: String },
});

const StatsSchema = new Schema({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
});

const UpcomingTourSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

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
    contact: ContactSchema,
    stats: StatsSchema,
    upcomingTours: [UpcomingTourSchema],
  },
  {
    timestamps: true,
  }
);

const GuidesModel = model("Guides", GuidesSchema);

module.exports = GuidesModel;
