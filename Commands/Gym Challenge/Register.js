const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");
const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "register",
	aliases: [],
	category: "Gym Challenge",
	description: "Sign up for the Ginune Region Gym Challenge",
	usage: "[Hometown]",
	permissions: [],
	run: async (client, message, args) => {
		let hometown = args.join(" ");
		const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
		let badges = await Badges.findOne({userID: message.author.id, serverID: message.guild.id});

		if(!badges){
			let newBadges = new Badges({
				userID: message.author.id,
				serverID: message.guild.id,
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
				count: 0,
				hometown: (hometown ? hometown : 'Location TBA'),
				points: 100
			});
			await newBadges.save()
							.then(() => message.channel.send(`You are now signed up for the Ginune Region Gym Challenge with a hometown of ${newBadges.hometown}`))
							.catch(err => console.log(err));
		}else{
			badges.hometown = (hometown ? hometown : 'Location TBA');
			await badges.save()
						.then(() => message.channel.send(`Changed hometown to ${badges.hometown}`))
						.catch(err => console.log(err));
		}

		db.disconnect();
	}
}
