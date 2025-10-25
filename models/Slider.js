const mongoose = require("mongoose");
const { Schema } = mongoose;

const SliderSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  image: { type: String, required: true },
  image2: { type: String, required: true },
  link: { type: String, required: true },
});

const Slider = mongoose.model("Slider", SliderSchema);

module.exports = Slider;
