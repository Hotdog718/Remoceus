const mongoose = require("mongoose");

const gymSettingsSchema = mongoose.Schema({
  serverID: String,
  type: String,
  banner: String,
  rules: String,
  sub: String,
  title: String,
  rank: String
});

module.exports = mongoose.model("gymSettings", gymSettingsSchema);
