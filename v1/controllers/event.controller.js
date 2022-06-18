const async_handler = require("express-async-handler");
const { EventModel } = require("../models/event.model");

const createEvent = async_handler(async (req, res) => {

  const { title, url, timestamp } = req.body;
  let dt1 = new Date();
  let dt2 = new Date(timestamp);
  if (dt1.getTime() > dt2.getTime()) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Timestamp is in the past",
          param: "timestamp",
          location: "body",
        },
      ],
    });
  }
  let evt = EventModel({ title, url, timestamp: dt2 });
  await evt.save();

  return res.json({
    success: true,
  });
});

module.exports = {
  createEvent,
};
