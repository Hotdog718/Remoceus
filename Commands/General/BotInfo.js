const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const pack = require("../../package.json");

module.exports = {
	name: "botinfo",
	aliases: [],
	category: "General",
	description: "Displays information on the bot",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		let bott = new MessageEmbed()
    .setTitle("Bot Info")
    .setColor(client.config.color)
    .setThumbnail(client.user.avatarURL())
    .addField("Bot Name",`${client.user.username}`)
    .addField("Bot Description", `${pack.description}`)
    .addField("Bot's Lord and Savior",`${pack.author}`)
		.addField("Uptime", ms(client.uptime))
    .setFooter(`Remoceus Version: ${pack.version}`);
    message.channel.send(bott);
	}
}
