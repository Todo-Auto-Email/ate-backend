const lower_alphabets = "abcdefghijklmnopqrstuvwxyz";
const upper_alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const numbers_n_0 = "123456789";
const specials = "!@#$%^&*()_-+=~:;<>,./?";

const alphabets = lower_alphabets + upper_alphabets;
const alphanum = alphabets + numbers;
const aplhaspecial = alphabets + specials;
const alphanumspecial = alphabets + alphanum + specials;

const OTP_LENGTH = require("../config/constants").OTP_LENGTH;

const randomString = (charset, length) => {
  let s = "";
  for (let i = 0; i < length; i++) {
    s = s.concat(
      charset.charAt(Math.floor(Math.random() * charset.length))
    );
  }
  return s;
};

const emailOtp = () => {
  return randomString(numbers, OTP_LENGTH);
};

module.exports = {
  emailOtp,
};
