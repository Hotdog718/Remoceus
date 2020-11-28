const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const FC = require("../../Models/FC.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "fc",
	aliases: [],
	category: "Game Info",
	description: "Displays yours or other peoples FC",
	usage: "none or <@user>",
	permissions: [],
	run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let leUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.find(member => member.user.username === args.join(" ")) || message.member;

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let friendCard = await FC.findOne({userID: leUser.id});
		db.disconnect();

		let embed = new MessageEmbed()
		.setTitle(`${leUser.user.username}\'s FC and IGN`)
		.setColor(leUser.roles.color.color || client.config.color)
		.setThumbnail(leUser.user.displayAvatarURL())
		.addField("FC", friendCard? friendCard.fc: "No FC set, use !setfc <fc> to set your fc (ex. !setfc 3883-7141-8049)")
		.addField("IGN", friendCard? friendCard.ign: "No IGN set, use !setign <ign> to set your ign (ex. !setign Thot Slayer)");

		message.channel.send(embed);
	}
}
