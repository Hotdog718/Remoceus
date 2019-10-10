const mongoose = require("mongoose");

const gymstatusSchema = mongoose.Schema({
  serverID: String,
  bug: String,
  dark: String,
  dragon: String,
  electric: String,
  fairy: String,
  fighting: String,
  fire: String,
  flying: String,
  ghost: String,
  grass: String,
  ground: String,
  ice: String,
  normal: String,
  poison: String,
  psychic: String,
  rock: String,
  steel: String,
  water: String
});

module.exports = mongoose.model("gymstatus", gymstatusSchema);
