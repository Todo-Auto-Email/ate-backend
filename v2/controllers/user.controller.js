const async_handler = require("express-async-handler");
const { UserModel } = require("../models/user.model");
const { WaitUserModel } = require("../models/waituser.model");
const { sendOtp } = require("../../utils/email");
const { encrypt } = require("../../utils/token");
const { emailOtp } = require("../../utils/randoms");
const { OTP_TIMEOUT_SECONDS } = require("../../config/constants");

const auth = async_handler(async (req, res) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await WaitUserModel.findOne({ email });
    if(!user) {
      return res.status(401).json({
        status: "error",
        errors: [
          {
            msg: "User not found. Please join waitlist to get access.",
            param: "email",
            location: "body",
          },
        ],
      });
    }

    return res.status(401).json({
      status: "error",
      errors: [
        {
          msg: "User not found. Please wait for admin to verify your waitlist request.",
          param: "email",
          location: "body",
        },
      ],
    });
  }

  const otp = emailOtp();
  user.otp = otp;
  user.otpUsed = false;
  user.otpTime = new Date();
  await user.save();
  await sendOtp(email, otp);

  return res.json({
    status: "success",
  });
});

const verify = async_handler(async (req, res) => {
  const { email, otp } = req.body;
  let user = await UserModel.findOne({ email, otp });
  let dt = new Date();
  if (
    !user ||
    user.otpUsed ||
    parseInt((dt.getTime() - user.otpTime.getTime()) / 1000) >
      OTP_TIMEOUT_SECONDS ||
    dt.getTime() - user.otpTime.getTime() < 0
  ) {
    return res.status(401).json({
      status: "error",
      errors: [
        {
          msg: "Invalid OTP",
          param: "otp",
          location: "body",
        },
      ],
    });
  }

  user.otpUsed = true;
  user.otp = "";

  await user.save();

  token = encrypt({ id: user._id });
  return res.json({
    status: "success",
    token: token,
  });
});

const check = (req, res) => {
  return res.json({
    status: "success",
  });
};

module.exports = {
  auth,
  verify,
  check,
};
