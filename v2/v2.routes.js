const express = require("express");
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const waitListRoutes = require("./routes/waitlist.routes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/event", eventRoutes);
router.use("/waitlist", waitListRoutes);

module.exports = router;
