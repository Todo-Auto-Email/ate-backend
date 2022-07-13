const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  subCount : {
    type: Number,
    default: 0,
  }
});

const EventModel = mongoose.model("Event", EventSchema);

module.exports = { 
  EventModel, 
  EventSchema 
};
