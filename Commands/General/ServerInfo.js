const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "serverinfo",
	aliases: [],
	category: "General",
	description: "Displays information on the current server",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
    	let thumbnail = message.guild.iconURL();

		await message.guild.members.fetch({force: true});

		let serverEmbed = new MessageEmbed()
		.setTitle(`${message.guild.name}`)
		.setColor(client.config.color)
		.addField("Server Owner",`${message.guild.owner}`)
		.addField("Region",`${message.guild.region}`)
		.addField("Member Count",`${message.guild.members.cache.filter(member => !member.user.bot).array().length}`, true)
		.addField("Bot Count",`${message.guild.members.cache.filter(member => member.user.bot).array().length}`, true)
		.addField("Creation Date",`${message.guild.createdAt}`);
		if(thumbnail){
			serverEmbed.setThumbnail(`${thumbnail}`);
		}
		message.channel.send(serverEmbed);
	}
}
