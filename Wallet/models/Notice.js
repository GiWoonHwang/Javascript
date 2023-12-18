const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      // 공지 활성화 비활성화 여부
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Notice   = mongoose.model('Notice', userSchema);
module.exports = Notice 