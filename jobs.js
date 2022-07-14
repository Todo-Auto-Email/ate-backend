const cron = require("node-cron");
const { sendMail } = require("./utils/email");
const { UserModel } = require("./v2/models/user.model");

const sendUpdates = async () => {
  try {
    const users = await UserModel.find({}).populate("events");
    users.forEach(async (user) => {
      const { events } = user;
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
    });
  } catch (err) {
    console.log("Error in CRON send update : ", err);
  }
};

const scheduler = () => {
  cron.schedule("0 0 */12 * * *", async () => {
    console.log("Sending updates : ", new Date());
    await sendUpdates();
  });
};

module.exports = scheduler;
