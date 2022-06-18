const async_handler = require("express-async-handler");
const { UserModel } = require("../models/user.model");

const signup = async_handler(async (req, res) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel({ email });
    // await user.save();
  }
  return res.json(user);
});

module.exports = {
  signup,
};
