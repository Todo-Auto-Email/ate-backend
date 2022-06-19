const jwt = require("jsonwebtoken");

const encrypt = (data, time = "30d") => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: time,
  });
};

const decrypt = (token) => {
  try {
    return {
      success: true,
      data: jwt.verify(token, process.env.JWT_SECRET),
    };
  } catch (error) {
    return {
      success: false,
      data: null
    };
  }
};

module.exports = {
  encrypt,
  decrypt,
};
