const Purchase = require("../models/Purchase");
const User = require("../models/User");
const Otp = require("./otp");

const otp = new Otp();

exports.check = async (req, res) => {
  // #swagger.tags = ['store']
  const { email, value } = req.body;
  const user = await User.findOne({ email: email });
  if (value > user["crypto_dustin"]) {
    return res.json({
      message: "잔액 부족",
      value: -1,
    });
  }
  return res.json({
    message: "구매 및 선물 가능",
    value: 1,
  });
};

exports.purchase_or_gift = async (req, res) => {
  // #swagger.tags = ['store']
  try {
    const { email, name, image, value, to, token } = req.body;
    const user = await User.findOne({ email: email });
    let user_value = parseFloat(user["crypto_dustin"]) - parseFloat(value);
    console.log("to", to);

    if (to != null) {
      // 선물이면 0
      const register = await Purchase.create({
        email,
        name,
        image,
        value,
        to,
        status: 0,
        nickname: user.nickname,
        phone: user.phone,
        balance: user_value,
        sortation: "선물",
      });
    } else {
      const register = await Purchase.create({
        // 본인 구매면 1
        email,
        name,
        image,
        value,
        to,
        status: 1,
        nickname: user.nickname,
        phone: user.phone,
        balance: user_value,
        sortation: "구매",
      });
    }
    const user_update = await User.findOneAndUpdate(
      { email: email },
      { crypto_dotori: user_value }
    );

    res.status(201).json({
      message: "성공",
      value: 1,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.list = async (req, res) => {
  // #swagger.tags = ['store']
  try {
    let user = req.query.id; // 가져오고 싶은 유저
    let type = req.query.type; // 선물이야 본인구매야 ?

    if (type === "gift") {
      const dblist = await Purchase.find(
        { email: user, status: 0 },
        { _id: 0, __v: 0, updatedAt: 0 }
      );

      res.status(201).json({
        message: "성공",
        value: dblist,
      });
    } else if (type === "purchase") {
      const dblist = await Purchase.find(
        { email: user, status: 1 },
        { _id: 0, __v: 0, updatedAt: 0 }
      );

      res.status(201).json({
        message: "성공",
        value: dblist,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
