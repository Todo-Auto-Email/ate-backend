const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server API is running');
});

const PORT = process.env.PORT || 5000;

const main = async() => {
    app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV||"development"} mode on port ${PORT}...`.yellow.bold));
};

main();