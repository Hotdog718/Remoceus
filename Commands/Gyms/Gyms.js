const { MessageEmbed } = require("discord.js");
const Gyms = require("../../Models/Gyms.js");
const b = require("../../Badges.json")

module.exports = {
	name: "gyms",
	aliases: [],
	category: "Gyms",
	description: "Displays currently open gyms",
	usage: "",
	permissions: [],
	run: async (client, message, args) => {
		Gyms.findOne({
			serverID: message.guild.id
		}, (err, gyms) => {
			let embed = new MessageEmbed()
			.setTitle("Available Gym Leaders")
			.setColor(client.config.color);
			if(!gyms){
				embed.addField("No Gyms are Open", "Please come back later!");
			}else{
				let gymCount = 0;
				for(let i = 0; i<client.gymTypes.length; i++){
					if(gyms[client.gymTypes[i]].toLowerCase() === "open"){
						embed.addField(`${client.helpers.toTitleCase(client.gymTypes[i])}`, b[client.gymTypes[i]], true);
						gymCount++;
					}
				}
				if(gymCount === 0){
					embed.addField("No Gyms are Open", "Please come back later!");
				}
			}
			message.channel.send(embed);
		})
	}
}
