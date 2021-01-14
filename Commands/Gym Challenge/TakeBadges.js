const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "takebadges",
	aliases: ["tbs"],
	category: "Gym Challenge",
	description: "Takes all badges from the user",
	usage: "<@user>",
	permissions: ["Administrator"],
	run: async (client, message, args) => {
		if(!message.member.hasPermission("ADMINISTRATOR", false, true, true)){
			client.errors.noPerms(message, "Administrator");
			return;
		}
		let pUser = message.guild.member(message.mentions.users.first());
		
		if(!pUser){
			client.errors.noUser(message);
			return;
		}

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		await Badges.findOneAndDelete({userID: pUser.id, serverID: message.guild.id})
		db.disconnect();
		message.channel.send(`${pUser.user.username}\'s badges have been revoked`);
		message.react('✅')
			   .catch(console.error);
	}
}
