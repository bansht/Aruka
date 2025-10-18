const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SponsorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  link: { type: String }, 
  
});

const SponsorModel = model("Sponsor", SponsorSchema);

module.exports = SponsorModel;
