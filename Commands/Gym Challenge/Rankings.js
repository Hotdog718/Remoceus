const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "rankings",
	aliases: [],
	category: "Gym Challenge",
	description: "Displays the current gym rankings from most badges to least",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badgeArray = await Badges.find({serverID: message.guild.id});
		const resultsPerPage = 5;
		db.disconnect();
		await message.guild.members.fetch();
		if(badgeArray.length <= 0) return message.channel.send(`Sorry, there was no documents that I could find.`);
		await message.guild.members.fetch();
		badgeArray = badgeArray.sort((a, b) => {
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
		
		client.helpers.createListEmbed(client, message, badgeArray, resultsPerPage, getEmbed);
	}
}

function getEmbed(client, message, badgeArray, resultsPerPage, index){
	let maxPages = Math.ceil(badgeArray.length/resultsPerPage);
	let embed = new MessageEmbed()
	.setTitle(`Current SL Gym Rankings`)
	.setColor(client.config.color)
	.setThumbnail(message.guild.iconURL())
	.setFooter(`Page ${index+1} of ${maxPages}`);

	for(let i = index*resultsPerPage; i < badgeArray.length && i < (index+1)*resultsPerPage; i++){
		let member = message.guild.members.cache.get(badgeArray[i].userID);
		embed.addField(`#${i+1}: ${member ? (member.nickname || member.user.username) : "User not found"}`, `Hometown: ${badgeArray[i].hometown || "Location TBA"}\nPoints: ${badgeArray[i].points}\nBadge Count: ${badgeArray[i].count}`);
	}
	return embed;
}
