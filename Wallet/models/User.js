const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 단방향 해시 함수
const saltRound = 10; // bcrypt 해시를 계산하는데 필요한 시간을 제어
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    admin: {
      type: Number,
      default: 0,
    },
    nickname: {
      type: String,
    },
    email: {
      type: String,
      trim: true, //  스페이스를 없애주는 역할을 함
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    token: {
      type: String,
      default: "-",
    },
    dustin: {
      type: Number,
      default: 0,
    },
    crypto_dustin: {
      type: Number,
      default: 0,
    },
    wallet: {
      type: String,
      default: "-",
    },
    priv: {
      type: String,
      default: "-",
    },
    phone: {
      type: String,
      default: "-",
    },
    secret: {
      // 토큰 시크릿 키
      type: String,
      default: "-",
    },
    status: {
      // 유저 활성화 비활성화 여부
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  // pre는 스키마에 데이터가 저장되기 전 수행할 작업들을 지정함
  let user = this;

  // 파라미터로 들어온 값이 db에 기록된 값과 비교해서 변경된 경우는 true를, 그렇지 않은 경우는 false를 반환하는 함수입니다.
  if (user.isModified("password")) {
    // 솔트(salt)를 생성하는데 솔트는 해시 함수에서 암호화된 비밀번호를 생성할 때 추가되는 바이트 단위의 임의의 문자열이다. ​
    bcrypt.genSalt(saltRound, function (err, salt) {
      // 솔트를 만든다.
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // myPlaintexPassword는 유저가 입력한 비밀번호, hash는 암호화 된 비밀번호
        // Store hash in your password DB
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  // pre는 스키마에 데이터가 저장되기 전 수행할 작업들을 지정함
  let update = this.getUpdate();
  let user = this;
  // console.log("empty",isEmpty(update.password))

  // 파라미터로 들어온 값이 db에 기록된 값과 비교해서 변경된 경우는 true를, 그렇지 않은 경우는 false를 반환하는 함수입니다.
  if (update.password != null) {
    // 솔트(salt)를 생성하는데 솔트는 해시 함수에서 암호화된 비밀번호를 생성할 때 추가되는 바이트 단위의 임의의 문자열이다. ​
    bcrypt.genSalt(saltRound, function (err, salt) {
      // 솔트를 만든다.
      if (err) return next(err);
      bcrypt.hash(update.password, salt, function (err, hash) {
        // myPlaintexPassword는 유저가 입력한 비밀번호, hash는 암호화 된 비밀번호
        // Store hash in your password DB
        if (err) return next(err);
        update.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.comparePassword2 = function (plainPassword) {
  const data = bcrypt.compare(plainPassword, this.password);
  return data;
};

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

const User = mongoose.model("User", userSchema);
module.exports = User;
