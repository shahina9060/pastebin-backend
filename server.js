const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const router = require("./routes/pasteRoutes")
const database = require("./config/db")

database();
const allowedOrigins = [
  "http://localhost:3000",
  "https://pastebin-frontend-five.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin, like mobile apps or curl/postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("CORS policy: Origin not allowed"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(router);


// Export the app — no app.listen()!
module.exports = app;
