const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");

const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "changetown",
	aliases: [],
	category: "Gyms",
	description: "Changes the hometown for the gym challenge page",
	usage: "<newTown>",
	permissions: [],
	run: async (client, message, args) => {
    if(message.deletable) message.delete();
    let townname = args.join(" ");
    let newTown = townname.replace(/[^A-Z:() ]/gi, "").trim();

    if(!newTown || newTown === "") newTown = "Location TBA";

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badges = await Badges.findOne({userID: message.author.id, serverID: message.guild.id});
		if(!badges) return message.channel.send(`You haven't registered for the gym challenge. Please use !register.`).then(m => m.delete({timeout: 5000})).then(() => db.disconnect()).catch(err => console.log(err));
		badges.hometown = newTown;
		await badges.save()
								.then(() => message.channel.send(`You have now changed your town to ${newTown}`))
								.then(m => m.delete({timeout: 5000}))
								.catch(err => console.log(err));
		db.disconnect();
	}
}
