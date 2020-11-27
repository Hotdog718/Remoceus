const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const GymRules = require("../../Models/GymRules.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "gymrules",
	aliases: ["gr"],
	category: "Gyms",
	description: "Displays a Types Gym Rules and more",
	usage: "<type>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();

		let type = args[0] ? args[0].toLowerCase(): "";

		//If no type given or type given isn't a gym type, send no type response
		if(!type) return client.errors.noType(message);
		type = type.toLowerCase();
		if(!client.gymTypes.includes(type)) return client.errors.noType(message);

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let rules = await GymRules.findOne({serverID: message.guild.id, type: type});
		db.disconnect();

		if(!rules) return;

		let embed = new MessageEmbed()
		.setTitle(`${client.helpers.toTitleCase(type)} Gym Rules`)
		.setColor(client.typeColors[type])
		.setDescription(`__***${rules.title}***__`)
		.setFooter(`${rules.location || "TBA"}\n${rules.majorLeague ? "Major League" : "Minor League"}`);
		if(rules.banner){
			embed.setImage(rules.banner)
		}

		embed.addField(`__**${(rules.separateRules) ? `Singles Rules` : `Rules`}**__`, formatRules(rules.rules.singles));
		if(rules.separateRules){
			embed.addField(`__**Doubles Rules**__`, formatRules(rules.rules.doubles));
		}
		if(rules.sub){
			embed.addField("__**Gym Sub**__", rules.sub);
		}
		message.channel.send(embed);
	}
}

function formatRules(rules){
	let str = ""
	if(rules.bannedPokemon){
		str += `-Banned Pokemon: ${rules.bannedPokemon}\n`;
	}
	if(rules.bannedDynamax){
		str += `-Banned Dynamax: ${rules.bannedDynamax}\n`;
	}
	if(rules.itemClause){
		str += `-${rules.itemClause}\n`;
	}
	if(rules.noLegends){
		str += `-No Legendary Pokemon\n`;
	}
	if(rules.battleReadyClause){
		str += `-Battle Ready Clause`;
	}
	if(!str){
		str = "-None."
	}
	return str;
}
