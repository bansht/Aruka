const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ContactSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  map: { type: String, required: true },
});

const ContactModel = model("Contact", ContactSchema);

module.exports = ContactModel;
