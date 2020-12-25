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
		if(!message.member.hasPermission("ADMINISTRATOR", false, true, true)) return client.errors.noPerms(message, "Administrator");
		let pUser = message.guild.member(message.mentions.users.first());
		if(!pUser) return client.errors.noUser(message);

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		await Badges.findOneAndDelete({userID: pUser.id, serverID: message.guild.id})
		db.disconnect();
		message.channel.send(`${pUser.user.username}\'s badges have been revoked`);
	}
}
