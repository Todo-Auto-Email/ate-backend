const { UserModel } = require("../v2/models/user.model");
const async_handler = require("express-async-handler");
const { decrypt } = require("../utils/token");

const protect = async_handler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const { success, data } = decrypt(token);
      if (!success) {
        return res.status(403).json({
          message: "Not authorized, token failed",
        });
      }
      const user = await UserModel.findById(data.id);
      if (!user) {
        return res.status(403).json({
          message: "Not authorized, token failed",
        });
      }
      req.user = user;
    } catch (error) {
      return res.status(403).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(403).json({
      message: "Not authorized, token not found",
    });
  }
  next();
});

const adminProtect = async_handler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const { success, data } = decrypt(token);
      if (!success) {
        return res.status(403).json({
          message: "Not authorized, token failed",
        });
      }
      const user = await UserModel.findById(data.id);
      if (!user) {
        return res.status(403).json({
          message: "Not authorized, token failed",
        });
      }

      if (!user.isAdmin) {
        return res.status(403).json({
          message: "Not authorized, you do not have admin rights",
        });
      }
      req.user = user;
    } catch (error) {
      return res.status(403).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(403).json({
      message: "Not authorized, no token found",
    });
  }
  next();
});

module.exports = {
  protect,
  adminProtect,
};
