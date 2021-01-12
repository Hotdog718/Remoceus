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

		if(!pUser) return client.errors.noUser(message);
		if(!type) return client.errors.noType(message);

		if(!client.gymTypes.includes(type.toLowerCase())) return message.channel.send(`Sorry, but ${type} is not a gym type.`).then(m => m.delete({timeout: 5000}));

		if(client.helpers.checkGyms(client, type, message.member, true)){
			const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
			let badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

			if(!badges) return message.channel.send(`There was an error. No data for this user was found.`).then(m => m.delete({timeout: 5000}));

			if(!badges[type.toLowerCase()]) return message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`).then(m => m.delete({timeout: 5000}));
			badges[type.toLowerCase()] = false;
			badges.count--;
			await badges.save()
									.then(() => db.disconnect())
									.then(() => message.channel.send(`${message.author.tag} has taken ${pUser.user.tag}\'s ${type.toLowerCase()} badge!`))
									.then(msg => msg.delete({timeout: 5000}))
									.catch(err => console.log(err));

		}else {
			return message.channel.send("oof.").then(msg => msg.delete({timeout: 5000}));
		}
	}
}
