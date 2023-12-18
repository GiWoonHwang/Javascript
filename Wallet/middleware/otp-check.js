const Otp = require("../service/otp");
const User = require("../models/User");

const otp = new Otp();

const opt_check = async (req, res, next) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email: email });
  if ((await otp.verify(token, user["secret"])) === false) {
    return res.status(400).send({
      message: "otp 잘못 입력",
      value: -1,
    });
  }
  next();
};

module.exports = opt_check;
