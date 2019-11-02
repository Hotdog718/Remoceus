const mongoose = require("mongoose");

const fcSchema = mongoose.Schema({
  userID: String,
  fc: String,
  ign: String
});

module.exports = mongoose.model("fc", fcSchema);
