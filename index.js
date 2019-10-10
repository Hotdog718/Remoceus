const { Client, Collection } = require("discord.js");
const client = new Client({disableEveryone: true});
const fs = require("fs");
const botconfig = require("./botconfig.json")
const errors = require("./Utils/Errors.js");

const token = require("./token.json")
const mongoose = require("mongoose")
mongoose.connect(
	token.mongodb_uri,
	{useNewUrlParser: true, useUnifiedTopology: true}
);

client.config = botconfig;
client.commands = new Collection();
client.aliases = new Collection();
client.errors = errors;

const Handlers = ["Commands.js", "Events.js"];
Handlers.forEach((r) => {
	require(`./Handlers/${r}`)(client);
})