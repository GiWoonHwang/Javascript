const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    value: {
      type: Number,
    },
    status: {
      type: Number,
      default: 1,
    },
    sortation: {
      type: String,
      default: "마이룸",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Myroom = mongoose.model("Myroom", userSchema);
module.exports = Myroom;
