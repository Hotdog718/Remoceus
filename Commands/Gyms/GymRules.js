const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "gymrules",
	aliases: ["gr"],
	category: "Gyms",
	description: "Displays a Types Gym Rules and more",
	usage: "<type>",
	permissions: [],
	run: async (client, message, args) => {
		let type = args[0] ? args[0].toLowerCase(): "";

		//If no type given or type given isn't a gym type, send no type response
		if(!type){
			client.errors.noType(message)
			return;
		}
		
		// return error if gym is not included in gym types
		if(!client.gymTypes.includes(type)){
			client.errors.noType(message);
			return;
		}
		
		let rules = await client.gymrules.getGymType(type, message.guild.id);
		
		if(!rules){
			message.channel.send('No data found.');
			message.react('❌')
			.catch(console.error);
			return;
		}
		
		let embed = new MessageEmbed()
		.setTitle(`${client.helpers.toTitleCase(type)} Gym Rules`)
		.setColor(client.typeColors[type])
		.setDescription(`__*~${rules.title}~*__`)
		.setFooter(`${rules.location || "TBA"}\n${rules.majorLeague ? "Major League" : "Minor League"}`);
		let emote = client.emojis.cache.find(e => e.name === type.toLowerCase());
		let thumb = emote ? emote.url : message.guild.iconURL();
		if(thumb){
			embed.setThumbnail(thumb);
		}
		if(rules.banner){
			embed.setImage(rules.banner)
		}

		
		embed.addField(`__**${(rules.separateRules) ? `Singles Rules` : `Rules`}**__`, formatRules(rules.rules.singles));
		if(rules.separateRules){
			embed.addField(`__**Doubles Rules**__`, formatRules(rules.rules.doubles));
		}

		embed.addField('Stats', `W-L Ratio: ${rules.wins}-${rules.losses}\nChallenge Cost: ${rules.cost}\nPoints Accumulated: ${rules.points}`)
		
		let gymLeaders = await client.helpers.getGymLeaders(message, client.helpers.toTitleCase(type));
		if(gymLeaders && gymLeaders.size > 0){
			embed.addField("__**Gym Leader(s)**__", gymLeaders.array().join(",\n"), true);
		}
		
		let gymSubs = await client.helpers.getGymSubs(message, client.helpers.toTitleCase(type));
		if(gymSubs && gymSubs.size > 0){
			embed.addField("__**Gym Sub(s)**__", gymSubs.array().join(",\n"), true);
		}

		embed.addField('Status', rules.open ? 'Open' : 'Closed');
		
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
