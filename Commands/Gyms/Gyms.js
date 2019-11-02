const { RichEmbed } = require("discord.js");
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
		let ServerID = message.guild.id;

		Gyms.findOne({
			serverID: ServerID
		}, (err, gyms) => {
			let embed = new RichEmbed()
			.setTitle("Available Gym Leaders")
			.setColor(client.config.color);
			if(!gyms){
				embed.addField("No Gyms are Open", "Please come back later!");
			}else{
				let gymCount = 0;
				for(let i = 0; i<client.gymTypes.length; i++){
					if(gyms[client.gymTypes[i]].toLowerCase() === "open"){
						embed.addField(`${client.gymTypes[i].substring(0,1).toUpperCase()}${client.gymTypes[i].substring(1).toLowerCase()}`, b[client.gymTypes[i]], true);
						gymCount++;
					}
				}
				//check for blanks
				if(gymCount%3 !== 0){
					embed.addBlankField(true);
					if((gymCount+1)%3 !== 0){
						embed.addBlankField(true);
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
