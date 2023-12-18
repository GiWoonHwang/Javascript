const AdminAuth = require("../models/AdminAuth");
const Admin = require("../models/Admin");

const user_read_auth = async (req, res, next) => {
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

const notice_read_auth = async (req, res, next) => {
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

const asset_read_auth = async (req, res, next) => {
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

const payment_read_auth = async (req, res, next) => {
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

const cs_read_auth = async (req, res, next) => {
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

const event_read_auth = async (req, res, next) => {
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

const super_read_auth = async (req, res, next) => {
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

// const auth = {
//   user   : user_read_auth,
//   notice : notice_read_auth,
//   asserts: asset_read_auth,
//   payment: payment_read_auth,
//   super  : super_read_auth,
// };

// 푸쉬
// module.exports = { user_read_auth }
// module.exports = { notice_read_auth } ;
// module.exports = { asset_read_auth } ;
// module.exports = { payment_read_auth } ;
// module.exports = { super_read_auth } ;

module.exports = {
  user_read_auth,
  notice_read_auth,
  asset_read_auth,
  payment_read_auth,
  super_read_auth,
  cs_read_auth,
  event_read_auth,
};

/* 
let module = { exports: {} };
let exports = module.exports;
// your code 
return module.exports;
*/
