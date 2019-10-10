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

		if(((type.toLowerCase() === "normal" && message.member.roles.find(role => role.name === "Normal Gym Leader"))
		|| (type.toLowerCase() === "fire" && message.member.roles.find(role => role.name === "Fire Gym Leader"))
		|| (type.toLowerCase() === "water" && message.member.roles.find(role => role.name === "Water Gym Leader"))
		|| (type.toLowerCase() === "Grass" && message.member.roles.find(role => role.name === "Grass Gym Leader"))
		|| (type.toLowerCase() === "electric" && message.member.roles.find(role => role.name === "Electric Gym Leader"))
		|| (type.toLowerCase() === "flying" && message.member.roles.find(role => role.name === "Flying Gym Leader"))
		|| (type.toLowerCase() === "bug" && message.member.roles.find(role => role.name === "Bug Gym Leader"))
		|| (type.toLowerCase() === "ghost" && message.member.roles.find(role => role.name === "Ghost Gym Leader"))
		|| (type.toLowerCase() === "poison" && message.member.roles.find(role => role.name === "Poison Gym Leader"))
		|| (type.toLowerCase() === "psychic" && message.member.roles.find(role => role.name === "Psychic Gym Leader"))
		|| (type.toLowerCase() === "dragon" && message.member.roles.find(role => role.name === "Dragon Gym Leader"))
		|| (type.toLowerCase() === "dark" && message.member.roles.find(role => role.name === "Dark Gym Leader"))
		|| (type.toLowerCase() === "rock" && message.member.roles.find(role => role.name === "Rock Gym Leader"))
		|| (type.toLowerCase() === "ground" && message.member.roles.find(role => role.name === "Ground Gym Leader"))
		|| (type.toLowerCase() === "fairy" && message.member.roles.find(role => role.name === "Fairy Gym Leader"))
		|| (type.toLowerCase() === "ice" && message.member.roles.find(role => role.name === "Ice Gym Leader"))
		|| (type.toLowerCase() === "fighting" && message.member.roles.find(role => role.name === "Fighting Gym Leader"))
		|| (type.toLowerCase() === "steel" && message.member.roles.find(role => role.name === "Steel Gym Leader")))
		|| message.member.hasPermission("MANAGE_ROLES", true, true)){

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
		}
		else {
			return message.channel.send("oof.").then(msg => msg.delete(5000));
		}
	}
}
