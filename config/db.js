let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function database() {
  if (cached.conn) return cached.conn;

  const mongoose = require("mongoose");
  cached.conn = await mongoose.connect(process.env.MONGO_URI);
  return cached.conn;
}

module.exports = database;
