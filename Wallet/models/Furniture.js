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
      default: "Furniture",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Furniture = mongoose.model("Furniture", userSchema);
module.exports = Furniture;
