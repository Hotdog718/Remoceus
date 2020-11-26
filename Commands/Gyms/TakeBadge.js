const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");

const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "takebadge",
	aliases: ["tb"],
	category: "Gyms",
	description: "Takes a badge from a user",
	usage: "<type> <@user>",
	permissions: [],
	run: async (client, message, args) => {
		let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
		let type = args[0];

		if(!pUser) return client.errors.noUser(message);
		if(!type) return client.errors.noType(message);

		if(client.helpers.checkGyms(client, type, message.member, true)){
			const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
			await Badges.findOne({
				userID: pUser.id,
				serverID: message.guild.id
			}, (err, badges) => {
				if(err) console.log(err);
				if(!badges){
					message.channel.send(`${pUser.user.username} hasn't registered for the gym challenge yet.`);
				}else{
					if(badges[type.toLowerCase()]){
						badges[type.toLowerCase()] = false;
						badges.count--;
						message.channel.send(`${message.author.tag} has taken ${pUser.user.tag}\'s ${type.toLowerCase()} badge!`).then(msg => msg.delete({timeout: 5000}));
					}else{
						message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`).then(m => m.delete({timeout: 5000}));
					}
					badges.save().catch(err => console.log(err));
				}
			})
			db.disconnect();
		}else {
			return message.channel.send("oof.").then(msg => msg.delete({timeout: 5000}));
		}
	}
}
