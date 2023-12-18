const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    nickname: {
      type: String,
    },
    asset: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
    memo: {
      type: String,
      default: "메모를 남겨 주세요",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", userSchema);
module.exports = Payment;
