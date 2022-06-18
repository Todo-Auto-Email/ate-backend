const express = require("express");
const { body } = require("express-validator");
const { adminProtect } = require("../../middlewares/auth");
const { bodyValidator } = require("../../middlewares/errors");
const eventControllers = require("../controllers/event.controller");

const router = express.Router();

router.post(
  "/create",
  adminProtect,
  body("title").isString(),
  body("url").isURL(),
  body("timestamp").isISO8601(),
  bodyValidator,
  eventControllers.createEvent
);

module.exports = router;
