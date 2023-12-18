const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true, //  스페이스를 없애주는 역할을 함
      required: true,
    },
    to: {
      type: String,
      minlength: 5,
      required: true,
    },
    from: {
      type: String,
    },
    hash: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: String,
    },
    asset: {
      type: String,
      default: "CRYPTO DUSTIN",
    },
    sortation: {
      type: String,
      default: "입금",
    },
    nickname: {
      type: String,
    },
    phone: {
      type: String,
    },
    balance: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Deposit = mongoose.model("Deposit ", userSchema);
module.exports = Deposit;
