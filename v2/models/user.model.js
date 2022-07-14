const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
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
  isAdmin : {
    type: Boolean,
    default: false,
  },
  timezoneOffset : {
    type: Number,
    default : 0,
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
  UserSchema,
};
