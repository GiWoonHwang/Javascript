const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    os: {
      type: String,
    },
    ip: {
      type: String,
    },
    update: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AdminInfo = mongoose.model("AdminInfo", userSchema);
module.exports = AdminInfo;
