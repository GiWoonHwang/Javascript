const Swap = require("../models/Swap");
const User = require("../models/User");
const Otp = require("./otp");

const otp = new Otp();

exports.check = async (req, res) => {
  // #swagger.tags = ['swap']
  const { email, dustin } = req.body;
  const user = await User.findOne({ email: email });

  if (dustin > user["dustin"]) {
    return res.json({
      message: "잔액 부족",
      value: -1,
    });
  } else {
    return res.json({
      message: "스왑 가능",
      value: 1,
    });
  }
};

exports.swap = async (req, res) => {
  // #swagger.tags = ['swap']
  const { email, dustin, crypto, token } = req.body;
  const user = await User.findOne({ email: email });
  const user_dustin = user["dustin"] - dustin;
  const user_crypto = parseFloat(user["crypto_dustin"]) + parseFloat(crypto);
  const user_updqte = await User.findOneAndUpdate(
    { email: email },
    { dustin: user_dustin, crypto_dustin: user_crypto }
  );
  const swap_db = await Swap.create({
    email,
    dustin,
    crypto,
  });
  return res.json({
    message: "스왑 성공",
    value: 1,
  });
};

exports.list = async (req, res) => {
  // #swagger.tags = ['swap']
  const swaplist = await Swap.find(
    { email: req.params["id"] },
    { _id: 0, __v: 0, email: 0, status: 0 }
  );
  return res.json({
    message: "스왑 리스트",
    value: swaplist,
  });
};
