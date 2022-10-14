const async_handler = require("express-async-handler");
const { sendMail } = require("../../utils/email");
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

const getUserEventsByMail = async () => {
  const { events } = req.user;
  if (events.length > 0) {
    const eventsToSend = events.filter((event) => {
      const now = new Date();
      const eventDate = new Date(event.timestamp);
      return eventDate > now;
    });
    if (eventsToSend.length > 0) {
      eventsToSend.sort((a, b) => {
        const aDate = new Date(a.timestamp);
        const bDate = new Date(b.timestamp);
        return aDate - bDate;
      });

      let message = "";
      message += `<h1> Your Todo Updates </h1>`;
      message += `Hello, you have ${eventsToSend.length} upcoming events:<br />`;
      message += `<table border='1' style='border-collapse:collapse'>`;
      message += `<thead>`;
      message += `<tr>`;
      message += `<th>Event Name</th>`;
      message += `<th>Date Time (UTC)</th>`;
      message += `<th>ETA</th>`;
      message += `<th>URL</th>`;
      eventsToSend.forEach((event) => {
        let dt = new Date(event.timestamp);
        let ndt = new Date(dt.getTime() - user.timezoneOffset * 60 * 1000);

        let diff = dt - new Date();
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        message += `<tr>`;
        message += `<td style='padding:10px;text-align:center;'>${event.title}</td>`;
        message += `<td style='padding:10px;text-align:center;'>${ndt
          .toUTCString()
          .slice(0, -4)}</td>`;
        message += `<td style='padding:10px;text-align:center;'>${days} days, ${hours} hours</td>`;
        message += `<td style='padding:10px;text-align:center;'>${event.url}</td>`;
        message += `</tr>`;
      });
      message += `</table>`;
      await sendMail(user.email, "Todo Updates", message);
    }
  }
  return res.json({
    success: true,
    message: "Sent mail successfully"
  })
};

module.exports = {
  createEvent,
  subscribe,
  unsubscribe,
  getUserEventsByMail,
};
