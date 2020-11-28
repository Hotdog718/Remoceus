const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "register",
	aliases: [],
	category: "Gyms",
	description: "Registers the user for the Gym Challenge",
	usage: "<name>, <hometown (optional)>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();
    let str = args.join(" ").trim();
    let arr = str.split(/,+\s*/g);
    let name = arr[0] || message.author.username;
    let town = arr[1] || "Location TBA";

		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badges = await Badges.findOne({userID: message.author.id, serverID: message.guild.id});
		if(badges) return message.channel.send(`You've already been signed up for the gym challenge, if you want to change your name or hometown, use !changename or !changetown`);

		const newBadges = new Badges({
			userID: message.author.id,
			serverID: message.guild.id,
			name: name,
			hometown: town,
			bug: false,
			dark: false,
			dragon: false,
			electric: false,
			fairy: false,
			fighting: false,
			fire: false,
			flying: false,
			ghost: false,
			grass: false,
			ground: false,
			ice: false,
			normal: false,
			poison: false,
			psychic: false,
			rock: false,
			steel: false,
			water: false,
			count: 0
		});
		await newBadges.save()
			.then(() => message.channel.send(`You have been registered for the gym challenge under the name ${name} and the town of ${town}`))
			.then(m => m.delete({timeout: 5000}))
			.catch(err => console.log(err));
		db.disconnect();
	}
}
