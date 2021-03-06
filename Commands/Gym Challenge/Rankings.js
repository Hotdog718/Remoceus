const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rankings",
	aliases: [],
	category: "Gym Challenge",
	description: "Displays the current gym rankings from most badges to least",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		const resultsPerPage = 5;
		await message.guild.members.fetch();
		const badgeArray = (await client.badges.getAllBadges(message.guild.id))
		.filter(value => {
			const member = message.guild.members.cache.get(value.userID);
			if(!member) return false;
			return true;
		})
		.sort((a, b) => {
			if(a.points > b.points){
				return -1;
			}
			if(a.points < b.points){
				return 1;
			}
			if(a.count == b.count){
				let aUser = message.guild.members.cache.get(a.userID);
				let bUser = message.guild.members.cache.get(b.userID);
				let aName = aUser ? aUser.user.username : "User not found";
				let bName = bUser ? bUser.user.username : "User not found";
				if(aName > bName){
					return 1;
				}
				if(aName < bName){
					return -1;
				}
				return 0;
			}
			return b.count - a.count;
		})

		if(badgeArray.length <= 0) return message.channel.send(`Sorry, there was no documents that I could find.`);
		
		client.helpers.createListEmbed(client, message, badgeArray, resultsPerPage, getEmbed);
	}
}

function getEmbed(client, message, badgeArray, resultsPerPage, index){
	let maxPages = Math.ceil(badgeArray.length/resultsPerPage);
	let embed = new MessageEmbed()
	.setTitle(`Current Trainer Rankings`)
	.setColor(client.config.color)
	.setThumbnail(message.guild.iconURL())
	.setFooter(`Page ${index+1} of ${maxPages}`);
	let rank = 1;
	for(let i = 0; i < badgeArray.length && i < index*resultsPerPage; i++){
		if(i > 0 && badgeArray[i-1].points > badgeArray[i].points) rank++;
	}
	for(let i = index*resultsPerPage; i < badgeArray.length && i < (index+1)*resultsPerPage; i++){
		let member = message.guild.members.cache.get(badgeArray[i].userID);
		if(i > 0 && badgeArray[i-1].points > badgeArray[i].points) rank++;
		embed.addField(`#${rank}: ${member ? (member.nickname || member.user.username) : "User not found"}`, `Hometown: ${badgeArray[i].hometown || "Location TBA"}\nPoints: ${badgeArray[i].points} (${client.helpers.getClass(badgeArray[i].points)} Division)\nBadge Count: ${badgeArray[i].count}`);
	}
	return embed;
}
