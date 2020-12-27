const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Badges = require("../../Models/Badges.js");
const { MessageEmbed, MessageCollector } = require("discord.js");
let index = 0;
let itemsPerPage = 10;
let maxPages = 0;

module.exports = {
	name: "displaybadges",
	aliases: [],
	category: "Gym Challenge",
	description: "Displays who has the given types gym badge",
	usage: "<type>",
	permissions: [],
	run: async (client, message, args) => {
		let type = args[0]? args[0].toLowerCase(): "";
		if(!type) return client.errors.noType(message);

		if(!client.gymTypes.includes(type)) return client.errors.noType(message)
		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badges = await Badges.find({serverID: message.guild.id});

		db.disconnect();

		let arr = filterType(badges, type);
		maxPages = Math.ceil(arr.length/itemsPerPage);
		let embed = await getEmbed(message, type, arr, client);

		message.channel.send(embed).then((msg) => {
			//set filter to only let only set reactions and message author to respond
			const filter = (m) => m && m.author.id === message.author.id;

			// Create MessageCollector
			const collector = new MessageCollector(message.channel, filter, {idle: 60000});
			// create reactionCollector
			// const collector = msg.createReactionCollector(filter, {});

			collector.on('collect', async (m) => {
				switch(m.content.toLowerCase()){
					case '!back':{
						index = (index-1) < 0? maxPages-1 :index-1;
						msg.edit(await getEmbed(message, type, arr, client));
						break;
					}
					case '!next':{
						index = (index+1)%maxPages;
						msg.edit(await getEmbed(message, type, arr, client));
						break;
					}
					case '!stop':{
						collector.stop("Manually Stopped");
						break;
					}
					default: break;
				}
			})

			collector.on('end', (collected, reason) => {
				if(reason === "Manually Stopped" && msg.deletable){
					msg.delete();
				}
			})
		});
	}
}

async function getEmbed(message, type, res, client){
	let embed = new MessageEmbed()
	.setThumbnail(message.guild.iconURL())
	.setColor(client.config.color)
	.setFooter(`Page ${index+1} of ${maxPages}`);
	if(res.length === 0){
		embed.setDescription("No one has earned this badge on the current server.");
	}else{
		let users = [];
		for(let i = index*itemsPerPage; i<(index+1)*itemsPerPage && i<res.length; i++){
			let user = await client.users.fetch(res[i].userID);
			if(user){
				users.push(`${user.tag}`)
			}else{
				users.push(`Unknown User`);
			}
		}
		users.sort((a, b) => {
			let nameA = a.toUpperCase();
			let nameB = b.toUpperCase();

			if(nameA > nameB){
				return 1;
			}
			if(nameA < nameB){
				return -1;
			}
			return 0;
		});
		embed.addField(`Users who have the ${type} badge`, users.join("\n"))
	}
	return embed;
}

function filterType(array, type){
	let newArray = [];
	for(let i = 0; i<array.length; i++){
		let result = array[i];
		if(result[type]){
			newArray.push(result);
		}
	}
	return newArray;
}
