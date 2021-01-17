const mongoose = require("mongoose");

const banListSchema = mongoose.Schema({
  serverID: String,
  pokemon: Array,
  dynamax: Array,
  abilities: Array,
  moves: Array,
  clauses: Array
});

module.exports = mongoose.model("banlists", banListSchema);
