const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");

const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "changename",
	aliases: [],
	category: "Gyms",
	description: "",
	usage: "<new name>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
    let newName = args.length > 0 ? args.join(" ") : message.author.username;

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});

		let badges = await Badges.findOne({userID: message.author.id, serverID: message.guild.id});
		if(!badges) return message.channel.send(`You haven't registered for the gym challenge. Please use !register.`).then(m => m.delete({timeout: 5000}));

		badges.name = newName;
		await badges.save()
								.then(() => message.channel.send(`You have now changed your name to ${newName}`))
								.then(m => m.delete({timeout: 5000}))
								.catch(err => console.log(err));
		db.disconnect();
	}
}
