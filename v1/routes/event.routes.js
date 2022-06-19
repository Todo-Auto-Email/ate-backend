const express = require("express");
const { body } = require("express-validator");
const { adminProtect, protect } = require("../../middlewares/auth");
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

router.post(
  "/subscribe",
  adminProtect,
  body("event").isString(),
  bodyValidator,
  eventControllers.subscribe
);

router.post(
  "/unsubscribe",
  protect,
  body("event").isString(),
  bodyValidator,
  eventControllers.unsubscribe
);

module.exports = router;
