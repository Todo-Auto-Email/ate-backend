const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp : {
    type: String,
  },
  otpUsed : {
    type: Boolean,
    default: false,
  },
  otpTime : {
    type: Date,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
  UserSchema,
};
