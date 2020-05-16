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
		if(!client.gymTypes.includes(type)) return client.errors.noType(message);

		GymRules.findOne({
			serverID: message.guild.id,
			type: type
		}, (err, gymrules) => {
			if(err) console.log(err);
			let embed = new MessageEmbed()
			.setTitle(`${client.helpers.toTitleCase(type)} Gym Rules`)
			.setColor(client.typeColors[type])
			.setImage(gymrules.banner)
			.setThumbnail(client.helpers.rankLinks[gymrules.rank.toUpperCase()])
			.setDescription(`__~${gymrules.title}~__` || `__~COMING SOON~__`)
			.addField("__Gym Rules__", gymrules.rules);
			if(gymrules.sub.toLowerCase() !== `none`){
				embed.addField(`__Gym Leader Sub__`, gymrules.sub);
			}

			message.channel.send(embed);
		})
	}
}
