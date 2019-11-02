const Badges = require("../../Models/Badges.js");

module.exports = {
	name: "takebadge",
	aliases: ["tb"],
	category: "Gyms",
	description: "Takes a badge from a user",
	usage: "<type> <@user>",
	permissions: [],
	run: async (client, message, args) => {
		let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
		let type = args[0];

		if(!pUser) return errors.noUser(message);
		if(!type) return errors.noType(message);

		if(client.errors.checkGyms(type, message.member, true)){
			Badges.findOne({
				userID: pUser.id,
				serverID: message.guild.id
			}, (err, badges) => {
				if(err) console.log(err);
				if(!badges){
					const newBadges = new Badges({
					userID: pUser.id,
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
					count: 0
				})
					message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`).then(m => m.delete(5000));
					newBadges.save().catch(err => console.log(err));
				}else{
					if(badges[type.toLowerCase()]){
						badges[type.toLowerCase()] = false;
						badges.count--;
						message.channel.send(`${message.author.tag} has taken ${pUser.user.tag}\'s ${type.toLowerCase()} badge!`).then(msg => msg.delete(5000));
					}else{
						message.channel.send(`${pUser.user.tag} didn't have the ${type.toLowerCase()} badge.`).then(m => m.delete(5000));
					}
					badges.save().catch(err => console.log(err));
				}
			})
		}else {
			return message.channel.send("oof.").then(msg => msg.delete(5000));
		}
	}
}
