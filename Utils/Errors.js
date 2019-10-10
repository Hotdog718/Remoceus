

module.exports = {
	"noUser": (message) => {
		message.channel.send("No user found").then(m => m.delete(5000));
	},
	"noPerms": (message, perm) => {
		message.channel.send(`Missing Permission: ${perm}`).then(m = m.delete(5000));
	},
	"noType": (message) => {
		message.channel.send("Could not find gym type").then(m => m.delete(5000));
	}
}