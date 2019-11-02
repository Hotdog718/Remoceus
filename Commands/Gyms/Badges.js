const Badges = require("../../Models/Badges.js");
const { RichEmbed } = require("discord.js");
const b = require("../../Badges.json");

module.exports = {
  name: "badges",
  aliases: [],
  category: "Gyms",
  description: "Displays the badge case of you or another user",
  usage: "<none or @user>",
  permissions: [],
  run: async (client, message, args) => {
	if(message.deletable) message.delete();

	let leUser = message.guild.member(message.mentions.users.first()) || message.member;


	Badges.findOne({
		userID: leUser.id,
		serverID: message.guild.id
	}, (err, badges) => {
		if(err) console.log(err);
		let embed = new RichEmbed()
		.setColor(client.config.color)
		.setTitle(`${leUser.user.username}'s Badges`);

		if(!badges){
			embed.addField("Error 404", "No Badges Found");
		}else{
			if(badges.count === 0){
				embed.addField("Error 404", "No Badges Found");
			}else{
				let types = ["bug","dark","dragon","electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"];
				for(let i = 0; i<types.length; i++){
					if(badges[types[i]]){
						embed.addField(`${types[i].substring(0,1).toUpperCase()}${types[i].substring(1).toLowerCase()}`,b[types[i]],true);
					}
				}

				if(badges.count%3 !== 0 && badges.count !== 0){
					embed.addBlankField(true)
				}
				if((badges.count+1)%3 !== 0 && badges.count !== 0){
					embed.addBlankField(true)
				}
				embed.addField("Badge Count",`${badges.count} out of 18`);
			}
		}
		message.channel.send(embed);
	})
  }
}
