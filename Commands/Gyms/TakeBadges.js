const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "takebadges",
	aliases: ["tbs"],
	category: "Gyms",
	description: "Takes all badges from the user",
	usage: "<@user>",
	permissions: ["Administrator"],
	run: async (client, message, args) => {
		if(!message.member.hasPermission("ADMINISTRATOR", true, true)) return client.errors.noPerms(message, "Administrator");
		let pUser = message.guild.member(message.mentions.users.first());
		if(!pUser) return errors.noUser(message);
		Badges.findOneAndDelete({
			userID: pUser.id,
			serverID: message.guild.id
		}, (err, res) =>{
			if(err) console.log(err);
			message.channel.send(`${pUser.user.username}\'s badges have been revoked`);
		})
	}
}
