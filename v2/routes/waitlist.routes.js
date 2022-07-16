const express = require("express");
const { body } = require("express-validator");
const { adminProtect } = require("../../middlewares/auth");
const { bodyValidator } = require("../../middlewares/errors");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post(
  "/joinWaitList",
  body("email").isEmail(),
  bodyValidator,
  userController.auth
);

router.post(
  "/verifyWaiter",
  adminProtect,
  body("uid").isEmail(),
  bodyValidator,
  userController.verify
);

module.exports = router;
