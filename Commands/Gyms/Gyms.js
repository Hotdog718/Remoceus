const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const Gyms = require("../../Models/GymRules.js");
const b = require("../../Badges.json")

module.exports = {
	name: "gyms",
	aliases: [],
	category: "Gyms",
	description: "Displays currently open gyms on the current server.",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});

		let majorGyms = await Gyms.find({open: true, majorLeague: true, serverID: message.guild.id});
		let minorGyms = await Gyms.find({open: true, majorLeague: false, serverID: message.guild.id});
		db.disconnect();

		let embed = new MessageEmbed()
		.setTitle(`List of open gyms`)
		.setColor(client.config.color)
		.setThumbnail(message.guild.iconURL())
		.setFooter(`${majorGyms.length+minorGyms.length} gyms open out of 18`);
		let majorEmotes = [];
		for(let i = 0; i < majorGyms.length; i++){
			let emote = client.emojis.cache.find(emote => emote.name === `${majorGyms[i].type}`) || b[majorGyms[i].type];
			majorEmotes.push(emote);
		}
		let minorEmotes = [];
		for(let i = 0; i < minorGyms.length; i++){
			let emote = client.emojis.cache.find(emote => emote.name === `${minorGyms[i].type}`) || b[minorGyms[i].type];
			minorEmotes.push(emote);
		}

		embed.addField("Major Gyms", majorEmotes.join(" ") || "No Major Gyms Open").addField("Minor Gyms", minorEmotes.join(" ") || "No Minor Gyms Open");

		message.channel.send(embed);
	}
}
