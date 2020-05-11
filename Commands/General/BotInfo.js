const { MessageEmbed } = require("discord.js");
const pack = require("../../package.json");

module.exports = {
	name: "botinfo",
	aliases: [],
	category: "General",
	description: "Displays information on the bot",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
		let bott = new MessageEmbed()
    .setTitle("Bot Info")
    .setColor(client.config.color)
    .setThumbnail(client.user.avatarURL())
    .addField("Bot Name",`${client.user.username}`)
    .addField("Bot Description", `${pack.description}`)
    .addField("Bot's Lord and Savior",`${pack.author}`)
    .setFooter(`Remoceus Version: ${pack.version}`);
    message.channel.send(bott);
	}
}
