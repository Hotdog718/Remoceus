const { MessageEmbed } = require("discord.js");
const b = require("../../Badges.json")

module.exports = {
	name: "gyms",
	aliases: [],
	category: "Gyms",
	description: "Displays currently open gyms on the current server.",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		let gyms = await client.gymrules.getGyms(message.guild.id);
		let majorGyms = gyms.filter((obj) => obj.majorLeague && obj.open);
		let minorGyms = gyms.filter((obj) => !obj.majorLeague && obj.open);

		let embed = new MessageEmbed()
		.setTitle(`List of open gyms`)
		.setColor(client.config.color)
		.setThumbnail(message.guild.iconURL())
		.setFooter(`${majorGyms.length+minorGyms.length} gyms open out of 18`);
		let majorEmotes = [];
		for(let i = 0; i < majorGyms.length; i++){
			let emote = client.emojis.cache.find(emote => emote.name === `${majorGyms[i].type}`);
			majorEmotes.push(emote ? emote : b[majorGyms[i].type]);
		}
		let minorEmotes = [];
		for(let i = 0; i < minorGyms.length; i++){
			let emote = client.emojis.cache.find(emote => emote.name === `${minorGyms[i].type}`);
			minorEmotes.push(emote ? emote : b[minorGyms[i].type]);
		}

		embed.addField("Major Gyms", majorEmotes.join(" ") || "No Major Gyms Open")
			 .addField("Minor Gyms", minorEmotes.join(" ") || "No Minor Gyms Open");

		message.channel.send(embed);
	}
}
