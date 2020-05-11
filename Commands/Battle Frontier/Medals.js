const { MessageEmbed } = require("discord.js");
const Medals = require("../../Models/Medals.js");

module.exports = {
	name: "medals",
	aliases: [],
	category: "Battle Frontier",
	description: "Displays your Medal Case",
	usage: "<none or @user>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let mUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.find(member => member.user.username === args.join(" ")) || message.member;

		Medals.findOne({
			userID: mUser.id,
			serverID: message.guild.id
		}, (err, medals) => {
			if(err) console.log(err);
			let embed = new MessageEmbed()
			.setTitle(`${mUser.user.username}\'s Medals`)
			.setColor(mUser.roles.color.color || client.config.color)
			.setThumbnail(mUser.user.displayAvatarURL())
			.addField("Bronze Medals", medals? medals.bronze: 10)
			.addField("Silver Medals", medals? medals.silver: 0)
			.addField("Gold Medals", medals? medals.gold: 0)
			.addField("Platinum Medals", medals? medals.platinum: 0);
			message.channel.send(embed);
		})
	}
}
