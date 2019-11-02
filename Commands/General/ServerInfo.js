const { RichEmbed } = require("discord.js")

module.exports = {
	name: "serverinfo",
	aliases: [],
	category: "General",
	description: "Displays information on the current guild",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
    let thumbnail = message.guild.iconURL;

    let serverEmbed = new RichEmbed()
    .setTitle(`${message.guild.name}`)
    .setColor(client.config.color)
    .addField("Server Owner",`${message.guild.owner}`)
    .addField("Total Members",`${message.guild.memberCount}`)
    .addField("Reigon",`${message.guild.region}`)
    .addField("Creation Date",`${message.guild.createdAt}`);
    if(thumbnail){
      serverEmbed.setThumbnail(`${thumbnail}`);
    }
		message.channel.send(serverEmbed);
	}
}
