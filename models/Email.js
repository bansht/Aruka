const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EmailSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, "Email хаяг оруулна уу!"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email хаяг буруу байна!"]
  },
  subscribed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const EmailModel = model("Email", EmailSchema);

module.exports = EmailModel;
