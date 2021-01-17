const { Client, Collection } = require("discord.js");
const client = new Client({
	presence: {
		status: "online",
		activity: {
			name: "!help"
		}
	}
});

const config = require("./botconfig.json");
const errors = require("./Utils/Errors.js");
const helpers = require("./Utils/Helper.js");
const typeColors = require("./Type Colors.json");
const bannedWords = require("./bannedWords.js");
const modifiers = require('./Utils/BadgeModifiers.js');

client.commands = new Collection();
client.aliases = new Collection();

client.gymTypes = ["bug", "dark", "dragon", "electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"];
client.major = ["bug", "dark", "dragon", "electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"];
client.minor = [];

client.config = config;
client.errors = errors;
client.helpers = helpers;
client.typeColors = typeColors;
client.bannedWords = bannedWords;
client.modifiers = modifiers;

const acla = require('./Mongo/ACLA.js');
const badges = require('./Mongo/Badges.js');
const banlist = require('./Mongo/BanList.js');
const gameinfo = require('./Mongo/GameInfo.js');
const gymrules = require('./Mongo/GymRules.js');
const roles = require('./Mongo/Roles.js');

client.acla = acla;
client.badges = badges;
client.banlist = banlist;
client.gameinfo = gameinfo;
client.gymrules = gymrules;
client.roles = roles;

const Handlers = ["Commands.js", "Events.js"];
Handlers.forEach((r) => {
	require(`./Handlers/${r}`)(client);
})
