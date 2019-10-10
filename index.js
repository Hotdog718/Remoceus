const { Client, Collection } = require("discord.js");
const client = new Client({disableEveryone: true});
const fs = require("fs");
const botconfig = require("./botconfig.json")

client.config = botconfig;
client.commands = new Collection();
client.aliases = new Collection();

const Handlers = ["Commands.js", "Events.js"];
Handlers.forEach((r) => {
	require(`./Handlers/${r}`)(client);
})