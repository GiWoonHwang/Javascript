const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true, //  스페이스를 없애주는 역할을 함
      required: true,
    },
    dustin: {
      type: Number,
    },
    crypto: {
      type: Number,
    },
  },
  {
    versionKey: false, // versionKey: false, // "__v" 항목이 생기지 않도록 설정
    timestamps: true,
  }
);

const Swap = mongoose.model("Swap ", userSchema);
module.exports = Swap;
