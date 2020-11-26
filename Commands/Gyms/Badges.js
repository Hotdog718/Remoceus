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
  				let major = [];
          let minor = [];
          for(let i = 0; i < client.major.length; i++){
            let emote = message.guild.emojis.cache.find(emote => emote.name === `badge_${client.major[i]}`)
            if(badges[client.major[i]]){
              major.push(emote ? emote : b[client.major[i]]);
            }
          }
          for(let i = 0; i < client.minor.length; i++){
            let emote = message.guild.emojis.cache.find(emote => emote.name === `badge_${client.minor[i]}`)
            if(badges[client.minor[i]]){
              minor.push(emote ? emote : b[client.minor[i]]);
            }
          }

          embed.addField(`__Major League Badges__`, major.length > 0 ? major.join(" ") : `No Major League badges.`)
               .addField(`__Minor League Badges__`, minor.length > 0 ? minor.join(" ") : `No Minor League badges.`);
				}
  				embed.setFooter(`Badge Count: ${badges.count} out of 18`);
  		}
  		message.channel.send(embed);
    })
    db.disconnect();
  }
}
