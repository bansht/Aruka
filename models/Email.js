const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EmailSchema = new mongoose.Schema({
  email: { type: String, required: true }
});

const EmailModel = model("Email", EmailSchema);

module.exports = EmailModel;
