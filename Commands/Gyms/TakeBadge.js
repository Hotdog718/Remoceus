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
		let pUser = message.guild.member(message.mentions.users.first());
		let type = client.helpers.getGymType(client, message.member) || args[0];
		
		if(!pUser){
			client.errors.noUser(message);
			return;
		}
		if(!type){
			client.errors.noType(message);
			return;
		}
		
		if(!client.gymTypes.includes(type.toLowerCase())) {
			message.channel.send(`Sorry, but ${type} is not a gym type.`);
			message.react('❌')
				   .catch(console.error);
			return;
		}

		if(!client.helpers.checkGyms(client, type, message.member, true)){
			message.channel.send("You do not have permission for this action.")
			message.react('❌')
				   .catch(console.error);
			return;
		}

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

		if(!badges){
			message.channel.send(`There was an error. No data for this user was found.`);
			return;
		}

		if(!badges[type.toLowerCase()]) return message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`);
		badges[type.toLowerCase()] = false;
		badges.count--;
		const prom = badges.save();
		prom.then(() => db.disconnect())
			.catch(console.error);
		prom.then(() => message.channel.send(`${message.author.tag} has taken ${pUser.user.tag}\'s ${type.toLowerCase()} badge!`));
		prom.then(() => message.react('✅'))
        	.catch(console.error);
		prom.catch(console.error);
		prom.catch((err) => message.react('❌'))
        	.catch(console.error);
	}
}
