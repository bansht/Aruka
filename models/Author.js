const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String },
});

const AuthorModel = model("Author", AuthorSchema);

module.exports = AuthorModel;
