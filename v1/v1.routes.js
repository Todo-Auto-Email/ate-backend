const express = require("express");
const userRoutes = require("./routes/user.routes");

const v1Router = express.Router();

v1Router.use("/user", userRoutes);

module.exports = v1Router;
