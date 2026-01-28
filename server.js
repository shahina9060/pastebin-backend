const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const router = require("./routes/pasteRoutes")
const database = require("./config/db")

database();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json());
app.use(router);


// Export the app — no app.listen()!
module.exports = app;
