const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    group: {
      type: String,
    },
    email: {
      type: String,
      trim: true, //  스페이스를 없애주는 역할을 함
      required: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "-",
    },
    status: {
      type: Number,
      default: 1,
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
    secret: {
      // otp 시크릿 키
      type: String,
      default: "-",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.generateToken = function (cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // 토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decode) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 데이터 베이스에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const Admin = mongoose.model("Admin", userSchema);
module.exports = Admin;
