const express = require("express");
const { body } = require("express-validator");
const { protect, adminProtect } = require("../../middlewares/auth");
const { bodyValidator } = require("../../middlewares/errors");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post(
  "/auth",
  body("email").isEmail(),
  bodyValidator,
  userController.auth
);

router.post(
  "/verify",
  body("email").isEmail(),
  body("otp").isString(),
  bodyValidator,
  userController.verify
);

router.get("/checkUser", protect, userController.check);

router.get("/checkAdmin", adminProtect, userController.check);

module.exports = router;
