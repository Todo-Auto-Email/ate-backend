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

const subscribe = async_handler(async (req, res) => {
  const { event } = req.body;
  let evt;
  try {
    evt = await EventModel.findById(event);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Invalid event id",
          param: "event",
          location: "body",
        },
      ],
    });
  }
  if (!evt) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Event not found",
          param: "event",
          location: "body",
        },
      ],
    });
  }

  let present = false;
  for (let i = 0; i < req.user.events.length; i++) {
    if (req.user.events[i].toString() === event) {
      present = true;
      break;
    }
  }
  if (present) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Already subscribed to this event",
          param: "event",
          location: "body",
        },
      ],
    });
  }
  evt.subCount++;
  await evt.save();
  req.user.events.push(event);
  await req.user.save();

  return res.json({
    success: true,
  });
});

const unsubscribe = async_handler(async (req, res) => {
  const { event } = req.body;
  let evt;
  try {
    evt = await EventModel.findById(event);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Invalid event id",
          param: "event",
          location: "body",
        },
      ],
    });
  }
  if (!evt) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Event not found",
          param: "event",
          location: "body",
        },
      ],
    });
  }

  let present = false;
  for (let i = 0; i < req.user.events.length; i++) {
    if (req.user.events[i].toString() === event) {
      present = true;
      break;
    }
  }
  if (!present) {
    return res.status(400).send({
      status: "error",
      errors: [
        {
          msg: "Not subscribed to this event",
          param: "event",
          location: "body",
        },
      ],
    });
  }
  evt.subCount--;
  await evt.save();
  req.user.events.splice(req.user.events.indexOf(event), 1);
  await req.user.save();

  return res.json({
    success: true,
  });
});

module.exports = {
  createEvent,
  subscribe,
  unsubscribe,
};
