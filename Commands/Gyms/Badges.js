const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");

const Badges = require("../../Models/Badges.js");
const { MessageEmbed } = require("discord.js");
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

  	let leUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.find(member => member.user.username === args.join(" ")) || message.member;

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});

  	await Badges.findOne({
  		userID: leUser.id,
  		serverID: message.guild.id
  	}, (err, badges) => {
  		if(err) console.log(err);
  		let embed = new MessageEmbed()
  		.setColor(leUser.roles.color.color || client.config.color)
  		.setTitle(`${!badges ? leUser.user.username : badges.name}'s Badges`)
      .setThumbnail(leUser.user.displayAvatarURL())
      .setDescription(`${badges ? badges.hometown : ""}`);

  		if(!badges){
  			embed.addField("No registration", "Register to fight the gyms with !register");
  		}else{
  			if(badges.count === 0){
  				embed.addField("Error 404", "No Badges Found");
  			}else{
  				let types = ["bug","dark","dragon","electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"];
  				for(let i = 0; i<types.length; i++){
  					if(badges[types[i]]){
              //${types[i].substring(0,1).toUpperCase()}${types[i].substring(1).toLowerCase()}
  						embed.addField(`${client.helpers.toTitleCase(types[i])}`,b[types[i]],true);
  					}
  				}
  				embed.setFooter(`Badge Count: ${badges.count} out of 9`);
  			}
  		}
  		message.channel.send(embed);
    })
    db.disconnect();
  }
}
