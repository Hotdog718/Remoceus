const Medals = require("../../Models/Medals.js")

module.exports = {
	name: "takemedals",
	aliases: [],
	category: "Battle Frontier",
	description: "takes medals from the user",
	usage: "<amount> <bronze/silver/gold/platinum> <@user>",
	permissions: [],
	run: async (client, message, args) => {
    if(message.deletable) message.delete();

		if(!client.helpers.checkFrontier(message.member)) return message.channel.send("You are not a frontier brain").then(m => m.delete({timeout: 5000}));
		let amount = parseInt(args[0]);
		let type = args[1];

		if(!amount || isNaN(amount)) return message.channel.send("Please give an amount of medals to take").then(m => m.delete({timeout: 5000}));
		if(!type || !(type.toLowerCase() === "bronze" || type.toLowerCase() === "silver" || type.toLowerCase() === "gold" || type.toLowerCase() === "platinum")) return message.channel.send("Medal type must be Bronze, Silver, Gold, or Platinum").then(m => m.delete({timeout: 5000}));

		let mUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.find(member => member.user.username === args.slice(2).join(" "));

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
        if(newMedals[type.toLowerCase()] < Math.abs(amount)){
          message.channel.send(`Cannot take ${amount} medals from ${mUser.user.tag} because they only have ${newMedals[type.toLowerCase()]} ${type.toLowerCase()} medals.`).then(m => m.delete({timeout: 5000}));
        }else{
          newMedals[type.toLowerCase()] -= Math.abs(amount);
          message.channel.send(`Took ${amount} ${type.toLowerCase()} medals from ${mUser.user.tag}`).then(m => m.delete({timeout: 5000}));
          newMedals.save().catch(err => console.log(err))
        }
			}else{
        if(medals[type.toLowerCase()] < Math.abs(amount)){
          message.channel.send(`Cannot take ${amount} medals from ${mUser.user.tag} because they only have ${medals[type.toLowerCase()]} ${type.toLowerCase()} medals.`).then(m => m.delete({timeout: 5000}));
        }else{
          medals[type.toLowerCase()] -= Math.abs(amount);
          message.channel.send(`Took ${amount} ${type.toLowerCase()} medals from ${mUser.user.tag}`).then(m => m.delete({timeout: 5000}));
          medals.save().catch(err => console.log(err))
        }
			}
		})
	}
}
