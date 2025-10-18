const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const InstgmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  link: { type: String }, 
  
});

const InstgmModel = model("Instgm", InstgmSchema);

module.exports = InstgmModel;
