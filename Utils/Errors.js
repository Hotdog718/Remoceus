

module.exports = {
	noUser: (message) => {
		message.channel.send("No user found");
		message.react('❌');
	},
	noPerms: (message, perm) => {
		message.channel.send(`Missing Permission: ${perm}`);
		message.react('❌');
	},
	noType: (message) => {
		message.channel.send("Could not find gym type");
		message.react('❌');
	}
}
