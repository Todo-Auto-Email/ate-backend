const express = require("express");
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");

const v1Router = express.Router();

v1Router.use("/user", userRoutes);
v1Router.use("/event", eventRoutes);

module.exports = v1Router;
