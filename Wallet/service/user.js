const User = require("../models/User");
const Question = require("../models/Question");
const nodemailer = require("nodemailer");
const Otp = require("./otp");
const Validation = require("../service/validation");
const otp = new Otp();
const validation = new Validation();

global.env = process.env;

// 하나의 함수 하나의능기능
// header로 바꿔서 테스트해보기
// 동적할당과, 기존할당? 을 했을 때 구조분해에서 차이가 발생하는점 월요일에 바로
exports.user_update = async (req, res) => {
  // #swagger.tags = ['user']
  let token = req.cookies.x_auth;
  // console.log(token);
  const user = await User.findOne({ token: token });
  console.log("너 나오니?", user);
  return res.status(200).json({
    message: "유저정보 갱신",
    value: 1,
    config: {
      email: user.email,
      nickname: user.nickname,
      dustin: user.dustin,
      crypto_dustin: user.crypto_dustin,
      wallet: user.wallet,
      priv: user.priv,
      phone: user.phone,
      secret: user.secret,
      admin: user.admin,
    },
  });
};

exports.nickname_check = async (req, res) => {
  // 닉네임 확인
  // #swagger.tags = ['user']
  const { nickname } = req.body;
  const user = await User.find({ nickname: nickname });
  const nickname_list = user;
  if (user.length === 0) {
    return res.status(201).json({
      message: "사용 가능한 닉네임",
      value: 1,
    });
  } else {
    return res.status(201).json({
      message: "중복된 닉네임",
      value: -1,
    });
  }
};

exports.pwd_check = async (req, res) => {
  // 비밀번호 유효성 검사
  // #swagger.tags = ['user']
  try {
    const { email, pwd, pwd2 } = req.body;

    if ((await validation.valid_pwd_check(pwd)) === false) {
      return res.json({
        message: "비밀번호 양식 안맞음",
        value: -1,
      });
    } else if ((await validation.valid_pwd_trim(pwd)) === false) {
      return res.json({
        message: "비밀번호 공백 존재",
        value: -2,
      });
    } else if ((await validation.valid_pwd_length(pwd)) === false) {
      return res.json({
        message: "비밀번호 길이 문제",
        value: -3,
      });
    } else if ((await validation.valid_pwd_double_check(pwd, pwd2)) === false) {
      return res.json({
        message: "1차 2차 비번 다름",
        value: -4,
      });
    } else {
      const secret = await otp.generateSeceret();
      const auth = await otp.otpauth(email, otp.service, secret);
      const qr = await otp.convertQrcode(auth);
      return res.json({
        message: "비밀번호 양식 맞음",
        value: { QR: qr, secret: secret },
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.otp_check = async (req, res) => {
  // 구글 otp 확인
  // #swagger.tags = ['user']
  const { token, secret } = req.body;
  if ((await otp.verify(token, secret)) === true) {
    return res.json({
      message: "otp 입력 완료",
      value: 1,
    });
  } else {
    return res.json({
      message: "otp 입력 오류",
      value: -1,
    });
  }
};

exports.registr = async (req, res) => {
  // #swagger.tags = ['user']
  const { email, password, secret, nickname, phone } = req.body;
  const dbemail = await User.findOne({ email: email });
  try {
    if (validation.valid_user_check(dbemail) != null) {
      return res.json({
        message: "이미 존재하는 유저",
        value: -1,
      });
    } else {
      const user = await User.create({
        email,
        password,
        secret,
        nickname,
        phone,
      });

      return res.status(201).json({
        message: "회원가입 성공",
        value: 1,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.send_email = async (req, res) => {
  // 이메일 보내기 전 양식 체크
  // #swagger.tags = ['user']
  const senderName = "Wallet";
  const senderEmail = global.env.EMAIl;
  const emailSubject = "CODE";
  const emailHtml = "<div>123456789</div>";
  const { email } = req.body;
  try {
    if (validation.valid_email_check(email) === false) {
      res.json({
        message: "이메일 양식 안맞음",
        value: -1,
      });
    } else {
      const transporter = nodemailer.createTransport({
        // 사용하고자 하는 서비스
        // service: 'gmail',
        host: global.env.HOST_EMAIl,
        port: "587",
        auth: {
          user: senderEmail,
          pass: global.env.PASS,
        },
      });
      const send = await transporter.sendMail({
        // 보내는 곳의 이름과, 메일 주소를 입력
        from: `"` + senderName + `" ` + senderEmail,
        // 받는 곳의 메일 주소를 입력
        to: email,
        // 보내는 메일의 제목을 입력
        subject: emailSubject,
        // 보내는 메일의 내용을 입력
        // text: 일반 text로 작성된 내용
        // text: 'just test text',
        // html: html로 작성된 내용
        html: emailHtml,

        // 첨부파일 정보 객체를 입력
        // attachments: attachList
      });
      res.status(201).json({
        message: "이메일 전송 성공",
        code: 123456789,
        value: 1,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.login = async (req, res) => {
  // #swagger.tags = ['user']
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        message: "해당되는 유저 없음",
        value: -1,
      });
    } else if (userInfo.secret === null || userInfo.password === null) {
      return res.json({
        message: "otp 및 비밀번호가 초기화 된 유저",
        value: -4,
      });
    }
    if (userInfo.status === 0) {
      return res.json({
        message: "비활성화 유저",
        value: -3,
      });
    }
    userInfo.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          message: "비밀번호 틀림",
          value: -2,
        });
      } else {
        userInfo.generateToken((err, userInfo) => {
          if (err) {
            return res.status(400).send(err);
          }

          return res
            .cookie("x_auth", userInfo.token)
            .status(200)
            .json({
              message: "로그인 성공",
              value: 1,
              config: {
                email: userInfo.email,
                nickname: userInfo.nickname,
                dustin: userInfo.dustin,
                crypto_dustin: userInfo.crypto_dustin,
                wallet: userInfo.wallet,
                priv: userInfo.priv,
                phone: userInfo.phone,
                secret: userInfo.secret,
                admin: userInfo.admin,
              },
            });
        });
      }
    });
  });
};

exports.logout = (req, res) => {
  // #swagger.tags = ['user']
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      message: "로그아웃 성공",
      value: 1,
    });
  });
};

exports.set_otp = async (req, res) => {
  // #swagger.tags = ['user']
  const { email } = req.body;
  const user_secret = await otp.generateSeceret();
  const auth = await otp.otpauth(email, otp.service, user_secret);
  const qr = await otp.convertQrcode(auth);
  const user_update = await User.updateOne(
    { email: email },
    { secret: user_secret }
  );
  return res.json({
    message: "otp 재설정 완료",
    value: { QR: qr, secret: user_secret },
  });
};

exports.change_pw = async (req, res) => {
  // #swagger.tags = ['user']
  const { email, password, password2 } = req.body;

  if ((await validation.valid_pwd_check(password)) === false) {
    return res.json({
      message: "비밀번호 양식 안맞음",
      value: -2,
    });
  } else if ((await validation.valid_pwd_trim(password)) === false) {
    return res.json({
      message: "비밀번호 공백 존재",
      value: -3,
    });
  } else if ((await validation.valid_pwd_length(password)) === false) {
    return res.json({
      message: "비밀번호 길이 문제",
      value: -4,
    });
  } else if (
    (await validation.valid_pwd_double_check(password, password2)) === false
  ) {
    return res.json({
      message: "1차 2차 비번 다름",
      value: -5,
    });
  } else {
    // const user = await User.findOne({email:email});
    // user.comparePassword(pw, (err,isMatch)=> {
    //                 if(!isMatch){
    //                     return res.json({
    //                         message : '기존 비밀번호 틀림',
    //                         value   : -1
    //                     })
    //                 }else{
    //                     return res.status(200).json({
    //                         message : '비밀번호 변경 성공',
    //                         value   : 1
    //                     })}
    //                         });
    const result = await User.findOneAndUpdate(
      { email: email },
      { password: password }
    );
    return res.status(200).json({
      message: "비밀번호 변경 성공",
      value: 1,
    });
  }
};

exports.id_check = async (req, res) => {
  // 아이디 찾기
  // #swagger.tags = ['user']
  const { phone } = req.body;
  const user = await User.findOne({ phone: phone });
  if (user === null) {
    return res.status(200).json({
      message: "없는 번호",
      value: -1,
    });
  } else {
    return res.status(200).json({
      message: "아이디 확인",
      value: {
        phone: user["phone"],
        id: user["email"],
        nickname: user["nickname"],
        join: user["createdAt"],
      },
    });
  }
};

exports.require = async (req, res) => {
  // 문의하기
  // #swagger.tags = ['user']
  try {
    const { email, subject, content } = req.body;
    const userinfo = await User.findOne({ email: email });
    console.log("길이", subject.length);

    if (
      subject.length === 0 ||
      content.length === 0 ||
      subject === null ||
      content === null
    ) {
      res.status(400).json({
        message: "제목 및 내용은 필수 입력",
        value: -1,
      });
    } else {
      const user_quesion = await Question.create({
        email,
        subject,
        content,
        nickname: userinfo.phone,
        phone: userinfo.phone,
      });
      const user_id = String(user_quesion["_id"]);
      res.status(201).json({
        message: "문의 성공",
        value: user_id,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.require_modify = async (req, res) => {
  // 문의 수정
  // #swagger.tags = ['user']
  try {
    const id = req.params["id"];
    const { subject, content } = req.body;

    if (
      subject.length === 0 ||
      content.length === 0 ||
      subject === null ||
      content === null
    ) {
      res.status(400).json({
        message: "제목 및 내용은 필수 입력",
        value: -1,
      });
    } else {
      const modify = await Question.findOneAndUpdate(
        { _id: id },
        { subject: subject, content: content }
      );
      console.log(modify);
      res.status(201).json({
        message: "수정 성공",
        value: 1,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.require_delete = async (req, res) => {
  // 문의 삭제
  // #swagger.tags = ['user']
  try {
    const id = req.params["id"];
    const delete_db = await Question.deleteOne({ _id: id });
    res.status(201).json({
      message: "삭제 성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.require_list = async (req, res) => {
  // 질문 리스트 전체 가져오기
  // #swagger.tags = ['user']
  console.log(req.params["id"], req.query);
  const list = await Question.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0 }
  );
  console.log(list);

  res.status(201).json({
    message: "가져오기 성공",
    value: list,
  });
};

exports.more_pwdchange = async (req, res) => {
  // 비밀번호 변경
  // #swagger.tags = ['user']
  try {
    const { email, password, password2, pw } = req.body;

    if ((await validation.valid_pwd_check(password)) === false) {
      return res.json({
        message: "비밀번호 양식 안맞음",
        value: -2,
      });
    } else if ((await validation.valid_pwd_trim(password)) === false) {
      return res.json({
        message: "비밀번호 공백 존재",
        value: -3,
      });
    } else if ((await validation.valid_pwd_length(password)) === false) {
      return res.json({
        message: "비밀번호 길이 문제",
        value: -4,
      });
    } else if (
      (await validation.valid_pwd_double_check(password, password2)) === false
    ) {
      return res.json({
        message: "1차 2차 비번 다름",
        value: -5,
      });
    } else {
      const user = await User.findOne({ email: email });
      user.comparePassword(pw, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            message: "기존 비밀번호 틀림",
            value: -1,
          });
        } else {
          return res.status(200).json({
            message: "비밀번호 변경 성공",
            value: 1,
          });
        }
      });
      const result = await User.findOneAndUpdate(
        { email: email },
        { password: password }
      );
      return res.status(200).json({
        message: "비밀번호 변경 성공",
        value: 1,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.more_otpchange = async (req, res) => {
  // 구글 otp 변경
  // #swagger.tags = ['user']
  const { email } = req.body;
  const secret = await otp.generateSeceret();
  const auth = await otp.otpauth(email, otp.service, secret);
  const qr = await otp.convertQrcode(auth);
  const result = await User.findOneAndUpdate(
    { email: email },
    { secret: secret }
  );
  return res.json({
    message: "변경 성공",
    value: { QR: qr, secret: secret },
  });
};

exports.more_phonechange = async (req, res) => {
  // 휴대폰 번호 변경
  // #swagger.tags = ['user']
  const { email, phone } = req.body;
  const result = await User.findOneAndUpdate(
    { email: email },
    { phone: phone }
  );
  return res.json({
    message: "변경 성공",
    value: 1,
  });
};
