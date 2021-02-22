const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "bugreport",
	aliases: [],
	category: "General",
	description: "Sends a link to the issues page of the Remoceus github",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		const githubEmbed = new MessageEmbed()
        .setColor(client.config.color)
        .setTitle("Bug Report")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("To submit a bug report, go to the issues page of the remoceus github (Link below). Or, if you don't feel like creating a github account, you can always pester Hotdog in DMs.")
        .addField("Github Issues Page Link", "https://github.com/Hotdog718/Remoceus/issues");

        message.channel.send(githubEmbed);
	}
}
