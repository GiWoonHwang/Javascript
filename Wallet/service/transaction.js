require("dotenv").config();
const moaddr = process.env.MOADDR;
const mopriv = process.env.MOPRIV;
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const Deposit = require("../models/Deposit ");
const Account = require("./eth");
const Dustin = require("../models/Dustin");
const Otp = require("./otp");
const axios = require("axios");
const account = new Account();
const otp = new Otp();

exports.dustin_check = async (req, res) => {
  // #swagger.tags = ['transaction']
  const { email, dustin } = req.body;
  const user = await User.findOne({ email: email });
  if (dustin > user["dustin"]) {
    return res.json({
      message: "수량 부족",
      value: -1,
    });
  } else {
    return res.json({
      message: "출금 가능",
      value: 1,
    });
  }
};

exports.dustin_withrawal = async (req, res) => {
  // 출금
  // #swagger.tags = ['transaction']
  const { email, dustin, token } = req.body;
  const user = await User.findOne({ email: email });
  const user_dustin = user["dustin"];

  // if(await otp.verify(token,user['secret']) == false){
  // return res.json({
  // message : "otp 잘못 입력",
  // value   : -1
  // })
  // };
  const dustin_db = await dustin.create({
    email: email,
    value: dustin,
    status: 0,
    sortation: "출금",
    nickname: user.nickname,
    phone: user.phone,
    balance: user_dustin - dustin,
  });
  console.log(dustin_db._id);
  axios
    .post("http://www.naver.com", {
      userId: "byeolgori502",
      new_pw_1: "hunsman123!!",
      new_pw_2: "hunsman123!!",
    })
    .then(async function (response) {
      if (true) {
        // 출금을 확인시키는 어드민? 백오피스 응답에 따라
        const user_value = await User.findOneAndUpdate(
          { email: email },
          { dustin: user_dustin - dustin }
        );
        const dustin_db_update = await dustin.updateOne(
          { _id: dustin_db._id },
          { status: 1 }
        );

        return res.json({
          message: "출금 완료",
          value: 1,
        });
      } else {
        return res.json({
          message: "출금 실패",
          value: 99,
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

exports.dustin_deposit = async (req, res) => {
  // #swagger.tags = ['transaction']
  const { email, dustin } = req.body;
  const user = await User.findOne({ email: email });
  const user_dustin = parseFloat(user["dustin"]) + parseFloat(dustin);
  const user_value = await User.findOneAndUpdate(
    { email: email },
    { dustin: user_dustin }
  );
  const dustin_db = await dustin.create({
    email: email,
    value: dustin,
    status: 1,
    sortation: "입금",
    nickname: user.nickname,
    phone: user.phone,
    balance: user_dustin,
  });
  return res.json({
    message: "입금 완료",
    value: 1,
  });
};

exports.dustin_list = async (req, res) => {
  // 도토리 입출금 리스트
  // #swagger.tags = ['transaction']
  const dblist = await dustin.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  return res.json({
    message: "입출금 리스트 ",
    value: dblist,
  });
};

exports.crypto_deposit_list = async (req, res) => {
  // 암호화폐 거래내역(입금내역) 이더스캔에서 가져옴
  // #swagger.tags = ['transaction']
  const user = await User.findOne(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const useraddr = user["wallet"];
  const dbhash = await Deposit.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, updatedAt: 0 }
  );
  const hash_list = new Array();

  const key =
    "https://api-goerli.etherscan.io/api?module=account&action=tokentx&contractaddress=" +
    "0x128baDDE80A48186C5b30c9707DdEF173b1436c3" +
    "&address=" +
    useraddr +
    "&page=1&offset=100&startblock=0&endblock=latest&sort=asc&apikey=ND8HRWA2GTK1CKR276E7H6P7MB2SJNDFR7";

  let value_some = 0;
  for (let i of dbhash) {
    hash_list.push(i["hash"]);
  }

  axios.get(key).then(async function (response) {
    const data = response.data;
    for (let i in data["result"]) {
      if (
        data["result"][i]["to"] === useraddr.toLowerCase() &&
        !hash_list.includes(data["result"][i]["hash"]) &&
        data["result"][i]["from"] != moaddr
      ) {
        console.log("너 뭐하냐?");
        const inputdb = await Deposit.create({
          email: req.params["id"],
          to: user["wallet"],
          from: data["result"][i]["from"],
          hash: data["result"][i]["hash"],
          value: data["result"][i]["value"] / 1000000000000000000,
          created_at: data["result"][i]["timeStamp"],
          nickname: user.nickname,
          phone: user.phone,
        });
        value_some += await parseFloat(
          data["result"][i]["value"] / 1000000000000000000
        );
        const user_value = await User.findOneAndUpdate(
          { email: req.params["id"] },
          {
            crypto_dustin: parseFloat(user.crypto_dustin) + value_some,
            balance: parseFloat(user.crypto_dustin) + value_some,
          }
        );
      }
    }
    return res.json({
      message: "입금 리스트 가져오기 성공",
      value: 1,
    });
  });
};

exports.crypto_deposit_list_front = async (req, res) => {
  // 암호화폐 입금 리스트(프론트에 보여줌)
  // #swagger.tags = ['transaction']
  const dblist = await Deposit.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, email: 0, status: 0, updatedAt: 0 }
  );
  return res.json({
    message: "입금 리스트",
    value: dblist,
  });
};

exports.crypto_check = async (req, res) => {
  // #swagger.tags = ['transaction']
  const { email, to, value } = req.body;
  const user = await User.findOne({ email: email }, { _id: 0, __v: 0 });
  const user_value = user["crypto_dustin"];
  const validation = await account.isAddress(to);

  if (value >= user_value) {
    return res.json({
      message: "잔액부족",
      value: -1,
    });
  } else if (validation === false) {
    return res.json({
      message: "유효하지 않은 주소",
      value: -2,
    });
  } else {
    return res.json({
      message: "출금 가능",
      value: 1,
    });
  }
};

exports.crypto_withdral = async (req, res) => {
  // #swagger.tags = ['transaction']
  try {
    const { email, to, value, token } = req.body;
    const user = await User.findOne({ email: email }, { _id: 0, __v: 0 });
    const user_value = user["crypto_dustin"];
    const user_wallet = user["wallet"];
    const result = await User.updateOne(
      { email: email },
      { crypto_dustin: user_value - value }
    );
    const Withdrawal_list = await Withdrawal.create({
      email: email,
      to: to,
      from: user_wallet,
      hash: "-",
      status: 0,
      value: value,
      nickname: user.nickname,
      phone: user.phone,
      balance: user_value - value,
    });
    await res.json({
      message: "출금 신청 완료",
      value: 1,
    });
    const deploy = await account.token_transfer(moaddr, mopriv, to, value); // 모계좌가 전송함
    const Withdrawal_update = await Withdrawal.findOneAndUpdate(
      { _id: Withdrawal_list["_id"] },
      { hash: deploy["blockHash"], status: 1 }
    );
    console.log("끝났어 ?");
  } catch (err) {
    console.error(err);
  }
};

exports.crypto_withdral_list_front = async (req, res) => {
  // 암호화폐 출금 리스트(프론트에 보여줌)
  // #swagger.tags = ['transaction']
  const dblist = await Withdrawal.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, email: 0, updatedAt: 0 }
  );
  return res.json({
    message: "출금 리스트",
    value: dblist,
  });
};

exports.crypto_deposit_list_test = async (req, res) => {
  // #swagger.tags = ['transaction']
  const list = await account.toekn_collect(email, to);
  return;
};

exports.crypto_list = async (req, res) => {
  // #swagger.tags = ['transaction']
  const userinfo = await User.findOne({ email: req.params["id"] });
  console.log(userinfo);
  const deposit = await Deposit.find({ email: userinfo.email }, { __v: 0 });
  const withdrawal = await Withdrawal.find({ email: userinfo.email });

  return res.json({
    message: "데이터 묶음",
    deposit: deposit,
    withdrawal: withdrawal,
  });
};
