const mongoose = require("mongoose");

const assignableRolesSchema = mongoose.Schema({
  serverID: String,
  roles: Object
});

module.exports = mongoose.model("roles", assignableRolesSchema);
