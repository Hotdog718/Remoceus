const mongoose = require("mongoose");

const medalSchema = mongoose.Schema({
  userID: String,
  serverID: String,
  bronze: Number,
  silver: Number,
  gold: Number,
  platinum: Number
});

module.exports = mongoose.model("Medals", medalSchema);
