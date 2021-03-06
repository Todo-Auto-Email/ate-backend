const sgMail = require("@sendgrid/mail");
const { OTP_TIMEOUT_SECONDS } = require("../config/constants");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, html) => {
  await sgMail.send({
    to,
    from : process.env.SENDGRID_FROM,
    subject,
    html,
  });
};

const sendOtp = async (to, otp) => {
  const html = `<h1>Todo Auto Mailer OTP</h1>
  <p>Your OTP is : ${otp}</p>
  <p>Please use this OTP to login. 
  This OTP is valid for the next ${parseInt(OTP_TIMEOUT_SECONDS/60)} minutes.</p>`;
  await sendMail(to, "Todo Auto Mailer OTP", html);
}

module.exports = {
  sendMail,
  sendOtp
};
