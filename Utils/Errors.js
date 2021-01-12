

module.exports = {
	noUser: (message) => {
		message.channel.send("No user found");
	},
	noPerms: (message, perm) => {
		message.channel.send(`Missing Permission: ${perm}`);
	},
	noType: (message) => {
		message.channel.send("Could not find gym type");
	}
}
