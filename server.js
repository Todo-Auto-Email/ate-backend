const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const connectDb = require("./config/db");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server API is running');
});

// const v1routes = require("./v1/v1.routes");
// app.use("/api/v1", v1routes);

const v2routes = require("./v2/v2.routes");
app.use("/api/v2", v2routes);

const { notFound, errorHandler } = require("./middlewares/errors");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// const {scheduler} = require("./jobs");

const main = async() => {
    await connectDb();
    app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV||"development"} mode on port ${PORT}...`.yellow.bold));
    // scheduler();
};

main();