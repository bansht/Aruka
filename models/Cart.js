const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Shop" },
    //   Cart:{type:Schema.Types.ObjectId,ref:'Cart'},
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const CartModel = model("Cart", CartSchema);

module.exports = CartModel;
