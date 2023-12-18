// username 레포마다 다르게 설정 되어 있는지 테스트

const Notice = require("../models/Notice");
const Event = require("../models/Event");
const Question = require("../models/Question");
const Furniture = require("../models/Furniture");
const Myroom = require("../models/Myroom");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit ");
const Dotori = require("../models/Dotori");
const Purchase = require("../models/Purchase");
const Payment = require("../models/Payment");
const Retrieve = require("../models/Retrieve");
const AdminAuth = require("../models/AdminAuth");
const Admin = require("../models/Admin");
const AdminInfo = require("../models/AdminInfo");

const Otp = require("./otp");
const Validation = require("../controllers/validation");
const otp = new Otp();
const validation = new Validation();
const os = require("os");
const ip = require("ip");

exports.user_auth = async (req, res) => {
  // #swagger.tags = ['user']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.user_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.notice_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.notice_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.asset_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.asset_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.payment_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.payment_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.cs_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.cs_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.event_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.event_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

exports.store_auth = async (req, res) => {
  // #swagger.tags = ['admin']
  let token = req.cookies.x_auth;
  const admin = await Admin.findOne({ token: token });
  const auth = await AdminAuth.findOne({ name: admin.group });
  if (auth.store_manage_V != 1) {
    return res.json({
      message: "볼수 있는 권한 없음",
      value: -1,
    });
  } else {
    return res.json({
      message: "가능",
      value: 1,
    });
  }
};

// 어드민 아이디  : root@root.com
// 어드민 비밀번호: 1234
exports.admin_login = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email, password, token, secret } = req.body;
  const userinfo = await Admin.findOne({ email: email });
  if (userinfo === null) {
    return res.json({
      message: "잘못된 정보 입력",
      value: -1,
    });
  } else if (userinfo.password != password) {
    return res.json({
      message: "비밀번호 틀림",
      value: -2,
    });
  } else if (userinfo.status === 0) {
    return res.json({
      message: "비활성화 어드민",
      value: -4,
    });
  } else {
    if (userinfo.secret === "-") {
      const user_secret = await otp.generateSeceret();
      const auth = await otp.otpauth(email, otp.service, user_secret);
      const qr = await otp.convertQrcode(auth);
      const user_update = await Admin.findOneAndUpdate(
        { email: email },
        { secret: user_secret }
      );
      return res.json({
        message: "비밀번호 양식 맞음 및 최초 로그인",
        value: { QR: qr, secret: user_secret },
      });
    } else {
      const user = await User.findOne({ email: email });
      const check = await otp.verify(token, user.secret);
      if (check === false) {
        return res.json({
          message: "otp 입력 실패",
          value: -3,
        });
      } else {
        const user_update = await Admin.findOneAndUpdate(
          { email: email },
          { ip: ip.address(), os: os.type() }
        );
        userinfo.generateToken((err, userinfo) => {
          if (err) {
            return res.status(400).send(err);
          }

          return res
            .cookie("x_auth", userinfo.token)
            .status(200)
            .json({
              message: "로그인 성공",
              value: {
                email: userinfo.email,
                nickname: userinfo.nickname,
                dotori: userinfo.dotori,
                crypto_dotori: userinfo.crypto_dotori,
                wallet: userinfo.wallet,
                priv: userinfo.priv,
                phone: userinfo.phone,
                secret: userinfo.secret,
                admin: userinfo.admin,
              },
            });
        });
      }
    }
  }
};

exports.admin_list = async (req, res) => {
  // #swagger.tags = ['admin']
  db_list = await Admin.find({}, { _id: 0, token: 0, secret: 0 });
  return res.json({
    message: "어드민 리스트",
    value: db_list,
  });
};

exports.admin_info = async (req, res) => {
  // #swagger.tags = ['admin']
  const id = req.params["id"];
  console.log(id);
  db_list = await AdminInfo.findOne({ email: id });
  return res.json({
    message: "어드민 상세내역",
    value: db_list,
  });
};

exports.login = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email, password, token, secret } = req.body;
  const userinfo = await User.findOne({ email: email });
  // console.log(userinfo);
  if (userinfo === null) {
    return res.json({
      message: "잘못된 정보 입력",
      value: -1,
    });
  } else if (userinfo.admin === 0) {
    return res.json({
      message: "어드민이 아님",
      value: -4,
    });
  } else {
    const pwd_check = await userinfo.comparePassword2(password);
    if (pwd_check === false) {
      return res.json({
        message: "비밀번호 틀림",
        value: -2,
      });
    } else {
      if (userinfo.secret === "-") {
        const user_secret = await otp.generateSeceret();
        const auth = await otp.otpauth(email, otp.service, user_secret);
        const qr = await otp.convertQrcode(auth);
        const user_update = await User.updateOne(
          { email: email },
          { secret: user_secret }
        );
        return res.json({
          message: "비밀번호 양식 맞음 및 최초 로그인",
          value: { QR: qr, secret: user_secret },
        });
      } else {
        const user = await User.findOne({ email: email });
        const check = await otp.verify(token, user.secret);
        if (check === false) {
          return res.json({
            message: "otp 입력 실패",
            value: -3,
          });
        } else {
          userinfo.generateToken((err, userinfo) => {
            if (err) {
              return res.status(400).send(err);
            }

            return res
              .cookie("x_auth", userinfo.token)
              .status(200)
              .json({
                message: "로그인 성공",
                value: {
                  email: userinfo.email,
                  nickname: userinfo.nickname,
                  dotori: userinfo.dotori,
                  crypto_dotori: userinfo.crypto_dotori,
                  wallet: userinfo.wallet,
                  priv: userinfo.priv,
                  phone: userinfo.phone,
                  secret: userinfo.secret,
                  admin: userinfo.admin,
                },
              });
          });
        }
      }
    }
  }
};

exports.otp_reset = async (req, res) => {
  // #swagger.tags = ['admin']
  console.log("?");
  const { email } = req.body;
  userinfo = await User.findOneAndUpdate({ email: email }, { secret: null });
  return res.json({
    message: "초기화 완료",
    value: 1,
  });
};

exports.pwd_reset = async (req, res) => {
  // #swagger.tags = ['admin']
  console.log("?");
  const { email } = req.body;
  userinfo = await User.findOneAndUpdate({ email: email }, { password: null });
  return res.json({
    message: "초기화 완료",
    value: 1,
  });
};

exports.user_data = async (req, res) => {
  // #swagger.tags = ['admin']
  all_user = await User.find(
    {},
    { __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 }
  );
  return res.json({
    message: "모든 유저",
    value: all_user,
  });
};

exports.user_status = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email } = req.body;
  const user_updqte = await User.updateOne({ email: email }, { status: 0 });
  return res.json({
    message: "유저 비활성화 완료",
    value: 1,
  });
};

exports.notice = async (req, res) => {
  // 공지 작성
  // #swagger.tags = ['admin']
  try {
    const { subject, content, status } = req.body;
    if (
      subject.length === 0 ||
      content.length === 0 ||
      subject === null ||
      content === null
    ) {
      return res.status(400).json({
        message: "제목 및 내용은 필수 입력",
        value: -1,
      });
    } else {
      const notice = await Notice.create({
        subject,
        content,
        status,
      });
      const notice_id = String(notice["_id"]);
      return res.status(201).json({
        message: "등록 성공",
        value: notice_id,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.notice_delete = async (req, res) => {
  // 공지 삭제
  // #swagger.tags = ['admin']
  try {
    const id = req.params["id"];
    const delete_db = await Notice.deleteOne({ _id: id });
    return res.status(201).json({
      message: "삭제 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.notice_list = async (req, res) => {
  // 공지 리스트 전체 가져오기
  // #swagger.tags = ['admin']
  const list = await Notice.find({}, { _id: 0, __v: 0 });
  return res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.property_list = async (req, res) => {
  // #swagger.tags = ['admin']
  let data = new Object();
  const crypto_withrawal = await Withdrawal.find(
    {},
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const crypto_deposit = await Deposit.find(
    {},
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const dotori = await Dotori.find({}, { _id: 0, __v: 0, updatedAt: 0 });

  data.crypto_withrawa = crypto_withrawal;
  data.crypto_deposit = crypto_deposit;
  data.dotori = dotori;

  return res.json({
    message: "자산관리 리스트",
    value: data,
  });
};

exports.user_property_list = async (req, res) => {
  // 특정 유저의 거래리스트
  // #swagger.tags = ['admin']
  let data = new Object();
  const crypto_withrawal = await Withdrawal.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const crypto_deposit = await Deposit.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const dotori = await Dotori.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const store = await Purchase.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );

  data.crypto_withrawal = crypto_withrawal;
  data.crypto_deposit = crypto_deposit;
  data.dotori = dotori;
  data.store = store;

  return res.json({
    message: "자산관리 리스트",
    value: data,
  });
};

exports.transaction_list = async (req, res) => {
  // 유저의 도토리,크립토 도토리 입출금 리스트
  // #swagger.tags = ['admin']
  let data = new Object();
  const crypto_withrawal = await Withdrawal.find(
    {},
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const crypto_deposit = await Deposit.find(
    {},
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const dotori = await Dotori.find({}, { _id: 0, __v: 0, updatedAt: 0 });

  data.crypto_withrawal = crypto_withrawal;
  data.crypto_deposit = crypto_deposit;
  data.dotori = dotori;

  return res.json({
    message: "입출금 리스트",
    value: data,
  });
};

exports.event = async (req, res) => {
  // 이벤트 작성
  // #swagger.tags = ['admin']
  try {
    const { subject, content } = req.body;
    if (
      subject.length === 0 ||
      content.length === 0 ||
      subject === null ||
      content === null
    ) {
      return res.status(400).json({
        message: "제목 및 내용은 필수 입력",
        value: -1,
      });
    } else {
      const event = await Event.create({
        subject,
        content,
      });
      const event_id = String(event["_id"]);
      return res.status(201).json({
        message: "등록 성공",
        value: event_id,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.event_delete = async (req, res) => {
  // 이벤트 삭제
  // #swagger.tags = ['admin']
  try {
    const id = req.params["id"];
    const delete_db = await Event.deleteOne({ _id: id });
    return res.status(201).json({
      message: "삭제 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.event_list = async (req, res) => {
  // 이벤트 리스트 전체 가져오기
  // #swagger.tags = ['admin']
  const list = await Event.find({}, { _id: 0, __v: 0 });
  return res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.require_answer = async (req, res) => {
  // 문의에 답변달기
  // #swagger.tags = ['admin']
  try {
    const id = req.params["id"];
    const { subject, content, answer, status } = req.body;
    const modify = await Question.findOneAndUpdate(
      { _id: id },
      { answer: answer, status: status }
    );
    console.log(modify);
    return res.status(201).json({
      message: "수정 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.require_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const list = await Question.find({}, { updatedAt: 0 });
  res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.store_register = async (req, res) => {
  // minimi 등록
  // #swagger.tags = ['admin']
  try {
    const { name, image, description, value, type } = req.body;
    console.log("type", typeof type);
    if (type === "minimi") {
      const register = await Minimi.create({
        name,
        image,
        description,
        value,
        status: 1,
      });
      const register_id = String(register["_id"]);
      return res.status(201).json({
        message: "미니미 등록 성공",
        value: register_id,
      });
    } else if (type === "miniroon") {
      const register = await Miniroom.create({
        name,
        image,
        description,
        value,
        status: 1,
      });
      const register_id = String(register["_id"]);
      return res.status(201).json({
        message: "미니룸 등록 성공",
        value: register_id,
      });
    } else {
      return res.status(400).json({
        message: "잘못된 요청",
        value: -1,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.furniture_delete = async (req, res) => {
  // #swagger.tags = ['admin']
  try {
    const id = req.params["id"];
    const delete_db = await Furniture.deleteOne({ _id: id });
    return res.status(201).json({
      message: "삭제 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.myroom_delete = async (req, res) => {
  // #swagger.tags = ['admin']
  try {
    const id = req.params["id"];
    const delete_db = await Myroom.deleteOne({ _id: id });
    return res.status(201).json({
      message: "삭제 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.furniture_list = async (req, res) => {
  // 미니미 리스트 전체 가져오기
  // #swagger.tags = ['admin']
  console.log(req.params["id"], req.query);
  const list = await Furniture.find({}, { _id: 0, __v: 0 });
  return res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.myroom_list = async (req, res) => {
  // 미니룸 리스트 전체 가져오기
  // #swagger.tags = ['admin']
  console.log(req.params["id"], req.query);
  const list = await Myroom.find({}, { _id: 0, __v: 0 });
  return res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.email_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const list = await User.find(
    {},
    {
      __v: 0,
      password: 0,
      token: 0,
      wallet: 0,
      priv: 0,
      crypto_dotori: 0,
      updatedAt: 0,
      dotori: 0,
      nickname: 0,
      secret: 0,
      phone: 0,
      admin: 0,
      status: 0,
    }
  );
  return res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.store_business_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const list = await Purchase.find(
    {},
    { updatedAt: 0, nickname: 0, phone: 0, amount: 0, status: 0 }
  );
  return res.status(201).json({
    message: "모든 아이템 구매 리스트",
    value: list,
  });
};

exports.payment_regist = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email, asset, amount, status, memo } = req.body;
  const user = await User.findOne({ email: email });
  const data = await Payment.create({
    email,
    nickname: user.nickname,
    asset,
    amount,
    status,
    memo,
  });
  return res.status(201).json({
    message: "등록 성공",
    value: 1,
  });
};

exports.payment_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const list = await Payment.find({}, { __v: 0, updatedAt: 0 });
  return res.status(201).json({
    message: "불러오기 성공",
    value: list,
  });
};

exports.payment = async (req, res) => {
  const { datas } = req.body;

  for (data of datas) {
    const payment_db = await Payment.findOne({ _id: data.id }); // id값에 따른 db컬럼 조회
    if (payment_db.asset === "DUSTIN") {
      const userinfo = await User.findOne({ email: payment_db.email }); // 기존 잔액 가져오기 위함
      const user_update = await User.findOneAndUpdate(
        { email: payment_db.email },
        { dotori: userinfo.dotori + payment_db.amount }
      );
      const db_update = await Payment.findOneAndUpdate(
        { _id: data.id },
        { status: 1 }
      ); // 지급내역 업데이트
    } else if (payment_db.asset === "CRYPTO DUSTIN") {
      const userinfo = await User.findOne({ email: payment_db.email }); // 기존 잔액 가져오기 위함
      const user_update = await User.findOneAndUpdate(
        { email: payment_db.email },
        { crypto_dotori: userinfo.crypto_dotori + payment_db.amount }
      );
      const db_update = await Payment.findOneAndUpdate(
        { _id: data.id },
        { status: 1 }
      ); // 지급내역 업데이트
    }
  }
  return res.status(201).json({
    message: "지급 성공",
    value: 1,
  });
};

// ----------------------------------------------------------------------------------

exports.retrieve_regist = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email, asset, amount, status, memo } = req.body;
  const user = await User.findOne({ email: email });
  const data = await Retrieve.create({
    email,
    nickname: user.nickname,
    asset,
    amount,
    status,
    memo,
  });
  return res.status(201).json({
    message: "등록 성공",
    value: 1,
  });
};

exports.retrieve_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const list = await Retrieve.find({}, { __v: 0, updatedAt: 0 });
  return res.status(201).json({
    message: "불러오기 성공",
    value: list,
  });
};

exports.retrieve = async (req, res) => {
  // #swagger.tags = ['admin']
  const { datas } = req.body;

  for (data of datas) {
    const retrieve_db = await Retrieve.findOne({ _id: data.id }); // id값에 따른 db컬럼 조회
    if (retrieve_db.asset === "DUSTIN") {
      console.log("여긴들어와야 함");
      const userinfo = await User.findOne({ email: retrieve_db.email }); // 기존 잔액 가져오기 위함
      const user_update = await User.findOneAndUpdate(
        { email: retrieve_db.email },
        { dotori: userinfo.dotori - retrieve_db.amount }
      );
      const db_update = await Retrieve.findOneAndUpdate(
        { _id: data.id },
        { status: 1 }
      ); // 지급내역 업데이트
    } else if (retrieve_db.asset === "CRYPTO DUSTIN") {
      const userinfo = await User.findOne({ email: retrieve_db.email }); // 기존 잔액 가져오기 위함
      const user_update = await User.findOneAndUpdate(
        { email: retrieve_db.email },
        { crypto_dotori: userinfo.crypto_dotori - retrieve_db.amount }
      );
      const db_update = await Retrieve.findOneAndUpdate(
        { _id: data.id },
        { status: 1 }
      ); // 지급내역 업데이트
    }
  }
  return res.status(201).json({
    message: "회수 성공",
    value: 1,
  });
};

// 계정관리----------------------------------------------------------------------------------
exports.auth_regist = async (req, res) => {
  // #swagger.tags = ['admin']
  const {
    name,
    user_manage_V,
    user_manage_R,
    notice_manage_V,
    notice_manage_R,
    asset_manage_V,
    asset_manage_R,
    payment_manage_V,
    payment_manage_R,
    store_manage_V,
  } = req.body;

  const name_check = await AdminAuth.find({ name: name });

  if (name.length === 0 || name === null) {
    res.status(201).json({
      message: "권한 이름은 필수값입니다.",
      value: -1,
    });
  } else if (name_check.length != 0) {
    return res.status(201).json({
      message: "존재하는 권한 이름",
      value: -2,
    });
  } else if (
    user_manage_V === 0 &&
    user_manage_R === 0 &&
    notice_manage_V === 0 &&
    notice_manage_R === 0 &&
    asset_manage_V === 0 &&
    asset_manage_R === 0 &&
    payment_manage_V === 0 &&
    payment_manage_R === 0 &&
    store_manage_V === 0
  ) {
    return res.status(201).json({
      message: "최소 하나의 접근 권한을 선택해야 합니다.",
      value: -3,
    });
  } else {
    const db_update = await AdminAuth.create({
      name,
      user_manage_V,
      user_manage_R,
      notice_manage_V,
      notice_manage_R,
      asset_manage_V,
      asset_manage_R,
      payment_manage_V,
      payment_manage_R,
      store_manage_V,
    });
    return res.status(201).json({
      message: "권한 설정이 완료되었습니다.",
      value: 1,
    });
  }
};

exports.auth_list = async (req, res) => {
  // #swagger.tags = ['admin']
  const db_list = await AdminAuth.find({}, { __v: 0 });

  return res.status(201).json({
    message: "불러오기 완료",
    value: db_list,
  });
};

exports.register = async (req, res) => {
  // #swagger.tags = ['admin']
  const { email, name, password, password2, status, group } = req.body;
  const name_check = await Admin.find({ name: name });
  if (
    email.length === 0 ||
    name.length === 0 ||
    password.length === 0 ||
    password2 === 0 ||
    status === 0 ||
    group === 0
  ) {
    return res.status(201).json({
      message: "값을 입력해 주세요",
      value: -1,
    });
  } else if (name_check.length != 0) {
    return res.status(201).json({
      message: "중복되는 이름입니다.",
      value: -2,
    });
  } else if (password != password2) {
    return res.status(201).json({
      message: "비밀번호 확인 오류",
      value: -3,
    });
  } else {
    const admin = Admin.create({ group, email, name, password, status });
    return res.status(201).json({
      message: "어드민 생성 완료",
      value: 1,
    });
  }
};
