const async_handler = require("express-async-handler");
const { UserModel } = require("../models/user.model");
const { sendOtp } = require("../../utils/email");
const { encrypt } = require("../../utils/token");
const { emailOtp } = require("../../utils/randoms");

const auth = async_handler(async (req, res) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel({ email });
  }

  const otp = emailOtp();
  user.otp = otp;
  user.otpUsed = false;
  user.otpTime = new Date();
  await user.save();
  await sendOtp(email, otp);
  return res.json({
    status : "success"
  });
});

module.exports = {
  auth,
};
