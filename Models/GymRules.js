const mongoose = require('mongoose');

const gymRulesSchema = mongoose.Schema({
  type: String,
  serverID: String,
  rules: {
    singles: {
      bannedPokemon: String,
      bannedDynamax: String,
      itemClause: String,
      noLegends: Boolean,
      battleReadyClause: Boolean
    },
    doubles: {
      bannedPokemon: String,
      bannedDynamax: String,
      itemClause: String,
      noLegends: Boolean,
      battleReadyClause: Boolean
    }
  },
  banner: String,
  title: String,
  location: String,
  separateRules: Boolean,
  open: Boolean,
  majorLeague: Boolean
})

module.exports = mongoose.model("gymRules", gymRulesSchema);
