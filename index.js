const { Client, Collection } = require("discord.js");
const client = new Client({
	presence: {
		status: "online",
		activity: {
			name: "!help or !help list"
		}
	}
});
const fs = require("fs");
const botconfig = require("./botconfig.json")
const errors = require("./Utils/Errors.js");
const helper = require("./Utils/Helper.js")
const typeColors = require("./Type Colors.json");
const bannedWords = require("./bannedWords.js");

client.config = botconfig;
client.commands = new Collection();
client.aliases = new Collection();
client.polls = new Collection();
client.errors = errors;
client.gymTypes = ["bug", "dark", "dragon", "electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"];
client.major = ["bug", "electric", "fighting", "flying", "ground", "normal", "poison", "psychic", "rock"];
client.minor = ["dark", "dragon", "fairy", "fire", "ghost", "grass", "ice", "steel", "water"]
client.helpers = helper;
client.typeColors = typeColors;
client.bannedWords = bannedWords;

const Handlers = ["Commands.js", "Events.js"];
Handlers.forEach((r) => {
	require(`./Handlers/${r}`)(client);
})
