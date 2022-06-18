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
});

const EventModel = mongoose.model("Event", EventSchema);

module.exports = { 
  EventModel, 
  EventSchema 
};
