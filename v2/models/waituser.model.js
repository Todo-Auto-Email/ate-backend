const mongoose = require("mongoose");

const WaitUserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const WaitUserModel = mongoose.model("User", WaitUserSchema);

module.exports = {
  WaitUserModel,
  WaitUserSchema,
};
