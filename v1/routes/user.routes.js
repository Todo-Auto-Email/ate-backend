const express = require("express");
const { body } = require("express-validator");
const { bodyValidator } = require("../../middlewares/errors");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail(),
  bodyValidator,
  userController.signup
);

module.exports = router;
