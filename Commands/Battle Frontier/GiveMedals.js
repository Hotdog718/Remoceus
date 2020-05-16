const Medals = require("../../Models/Medals.js")

module.exports = {
	name: "givemedals",
	aliases: [],
	category: "Battle Frontier",
	description: "Awards a member with medals",
	usage: "<amount> <bronze/silver/gold/platinum> <@user>",
	permissions: [],
	run: async (client, message, args) => {
		if(message.deletable) message.delete();

		if(!client.helpers.checkFrontier(message.member)) return message.channel.send("You are not a frontier brain").then(m => m.delete({timeout: 5000}));
		let amount = parseInt(args[0]);
		let type = args[1];

		//if no amount given or amount isn't a number, send a message and exit the command
		if(!amount || isNaN(amount)) return message.channel.send("Please give an amount of medals to give").then(m => m.delete({timeout: 5000}));
		//if no type or type is not a given type, send a message and exit the command
		if(!type || !(type.toLowerCase() === "bronze" || type.toLowerCase() === "silver" || type.toLowerCase() === "gold" || type.toLowerCase() === "platinum")) return message.channel.send("Medal type must be Bronze, Silver, Gold, or Platinum").then(m => m.delete({timeout: 5000}));

		//search for a user in mentions or by username
		let mUser = message.guild.member(message.mentions.users.first()) || message.guild.members.find(member => member.user.username === args.slice(2).join(" "));

		//if no user is found, send no user error message in channel
		if(!mUser) return client.errors.noUser(message);

		Medals.findOne({
			userID: mUser.id,
			serverID: message.guild.id
		}, (err, medals) => {
			if(err) console.log(err);
			if(!medals){
				const newMedals = new Medals({
					userID: mUser.id,
					serverID: message.guild.id,
					bronze: 10,
					silver: 0,
					gold: 0,
					platinum: 0
				})
				newMedals[type.toLowerCase()] += Math.abs(amount);
				message.channel.send(`Awarded ${mUser.user.username} ${Math.abs(amount)} ${type} medals.`).then(m => m.delete({timeout: 5000}));
				newMedals.save().catch(err => console.log(err))
			}else{
				medals[type.toLowerCase()] += Math.abs(amount);
				message.channel.send(`Awarded ${mUser.user.username} ${Math.abs(amount)} ${type} medals.`).then(m => m.delete({timeout: 5000}));
				medals.save().catch(err => console.log(err))
			}
		})
	}
}
