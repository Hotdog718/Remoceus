

module.exports = {
	noUser: (message) => {
		message.channel.send("No user found");
		message.react('❌')
			   .catch(console.error);
	},
	noPerms: (message, perm) => {
		message.channel.send(`Missing Permission: ${perm}`);
		message.react('❌')
			   .catch(console.error);
	},
	noType: (message) => {
		message.channel.send("Could not find gym type");
		message.react('❌')
			   .catch(console.error);
	}
}
