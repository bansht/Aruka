const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OrdersSchema = new Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    travelDate: { type: String, required: false }, // эсвэл Date төрөл ашиглаж болно
    participants: { type: Number, default: 1, required: false },
    specialRequests: { type: String, required: false },
    description: { type: String, required: false },

    // Холбогдох аялал (Tour) болон хөтөч (Guide) холбох боломж
    tours: [
      {
        tour: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tour",
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const OrdersModel = model("Orders", OrdersSchema);

module.exports = OrdersModel;
