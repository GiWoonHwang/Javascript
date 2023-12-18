const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true, //  스페이스를 없애주는 역할을 함
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
    },
    asset: {
      type: String,
      default: "DUSTIN",
    },
    sortation: {
      type: String,
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

const Dustin = mongoose.model("Dustin ", userSchema);
module.exports = Dustin;
