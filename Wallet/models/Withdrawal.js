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
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    asset: {
      type: String,
      default: "CRYPTO",
    },
    sortation: {
      type: String,
      default: "출금",
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

const Withdrawal = mongoose.model("Withdrawal ", userSchema);
module.exports = Withdrawal;
