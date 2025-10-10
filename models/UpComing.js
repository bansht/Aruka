const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UpComingSchema = new Schema(
  {
    id: Number,
    title: { type: String, required: true },
    date: { type: String, required: true },
    duration: String,
    price: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UpComingModel = model("UpComing", UpComingSchema);

module.exports = UpComingModel;
