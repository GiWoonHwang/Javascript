const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    user_manage_V: {
      type: Number,
      default: 0,
    },
    user_manage_R: {
      type: Number,
      default: 0,
    },
    notice_manage_V: {
      type: Number,
      default: 0,
    },
    notice_manage_R: {
      type: Number,
      default: 0,
    },
    asset_manage_V: {
      type: Number,
      default: 0,
    },
    asset_manage_R: {
      type: Number,
      default: 0,
    },
    payment_manage_V: {
      type: Number,
      default: 0,
    },
    payment_manage_R: {
      type: Number,
      default: 0,
    },
    cs_manage_V: {
      type: Number,
      default: 0,
    },
    cs_manage_R: {
      type: Number,
      default: 0,
    },
    event_manage_V: {
      type: Number,
      default: 0,
    },
    event_manage_R: {
      type: Number,
      default: 0,
    },
    store_manage_V: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AdminAuth = mongoose.model("AdminAuth ", userSchema);
module.exports = AdminAuth;
