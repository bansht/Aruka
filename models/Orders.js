const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrdersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    travelDate: { type: String, required: true }, // эсвэл Date төрөл ашиглаж болно
    participants: { type: Number, default: 1 },
    specialRequests: { type: String },

    // Холбогдох аялал (Tour) болон хөтөч (Guide) холбох боломж
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour" },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
  },
  { timestamps: true }
);

const OrdersModel = model("Orders", OrdersSchema);

module.exports = OrdersModel;
