const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TestimonialsSchema = new Schema(
  {
    name: { type: String, required: false },
    title: { type: String, required: false },
    position: { type: String, required: false },
    text: { type: Number, required: false },
    description: { type: String, required: false },
    image: { type: String },
  });

  const TestimonialsModel = model("Testimonials", TestimonialsSchema);

  module.exports = TestimonialsModel;
