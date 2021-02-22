const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "serverinfo",
	aliases: [],
	category: "General",
	description: "Displays information on the current server",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		await message.guild.members.fetch();
		
		let tmpdate = new Date();
		
		let invdate = new Date(tmpdate.toLocaleString("en-US", {timeZone: "America/Toronto"}));

		let diff = tmpdate.getTime() - invdate.getTime();

		let date = new Date(tmpdate.getTime() - diff);

		let serverEmbed = new MessageEmbed()
		.setTitle(`${message.guild.name}`)
		.setColor(client.config.color)
		.addField("Server Owner",`${message.guild.owner}`)
		.setThumbnail(message.guild.iconURL())
		.addField("Region",`${message.guild.region}`)
		.addField('Server Date/Time', `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}\n${((date.getHours()-1)%12)+1}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getHours() >= 12 ? 'P.M.' : 'A.M.'}`)
		.addField("Member Count",`${message.guild.members.cache.filter(member => !member.user.bot).array().length}`, true)
		.addField("Bot Count",`${message.guild.members.cache.filter(member => member.user.bot).array().length}`, true)
		.addField("Creation Date",`${message.guild.createdAt}`);
		message.channel.send(serverEmbed);
	}
}
