const mongoose = require("mongoose");
const { Schema } = mongoose;

const SliderSchema = new Schema({
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    id: {
        type: String,
        default: function () {
            return this._id.toString();
        },
    },
    price: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    sender_invoice_id: {
        type: String,
    },
    qpay_invoice_id: {
        type: String,
    },
    status: {
        type: String,
        enum: ["paid", "pending"],
        default: "pending",
    },
    createdInvoiceDateTime: { type: Date },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Slider = mongoose.model("Slider", SliderSchema);

module.exports = Slider;