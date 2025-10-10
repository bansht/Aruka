const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ShopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    images: [String],
    discount: {
      type: Number,
      default: 0,
    },
    description: String,
    comments: [
      {
        comment: String,
        name: String,
        createdAt: String,
      },
    ],
    shipping: {
      free: {
        type: Boolean,
        default: false,
      },
      time: String,
      locations: String,
    },
  },
  {
    timestamps: true,
  }
);

const ShopModel = model("Shop", ShopSchema);

module.exports = ShopModel;
