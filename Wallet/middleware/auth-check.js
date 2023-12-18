const AdminAuth = require("../models/AdminAuth");
const Admin = require("../models/Admin");
const AdminInfo = require("../models/AdminInfo");
const os = require("os");
const ip = require("ip");

exports.user_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.user_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "유저",
  });
  next();
};

exports.notice_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.notice_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "공지",
  });
  next();
};

exports.asset_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.asset_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "자산",
  });
  next();
};

exports.payment_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.payment_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "지급",
  });
  next();
};

exports.cs_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.cs_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "cs",
  });
  next();
};

exports.event_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.event_manage_R != 1) {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "이벤트",
  });
  next();
};

exports.super_read_auth = async (req, res, next) => {
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.name != "super") {
    return res.json({
      message: "사용 권한 없음",
      value: -1,
    });
  }
  const update = await AdminInfo.create({
    email: admin.email,
    os: os.type(),
    ip: ip.address(),
    update: "슈퍼유저",
  });
  next();
};

// module.exports = user_read_auth
// module.exports = notice_read_auth;
// module.exports = asset_read_auth;
// module.exports = payment_read_auth;
// module.exports = super_read_auth;
