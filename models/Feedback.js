const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const FeedbackSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Нэрээ оруулна уу!"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email хаяг оруулна уу!"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Email хаяг буруу байна!"]
  },
  phone: { 
    type: String,
    trim: true
  },
  subject: { 
    type: String,
    trim: true
  },
  message: { 
    type: String, 
    required: [true, "Мессеж оруулна уу!"]
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
}, {
  timestamps: true
});

const FeedbackModel = model("Feedback", FeedbackSchema);

module.exports = FeedbackModel;
