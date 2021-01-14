const { mongodb_uri } = require("../../token.json");
const mongoose = require("mongoose");
const Badges = require("../../Models/Badges.js")

module.exports = {
  name: "givebadge",
  aliases: ["gb"],
  category: "Gyms",
  description: "Gives a badge to a user, usage depends on roles of user, if user has a gym leader role, just use <@user>, if moderator, use <type> <@user>",
  usage: "<type> <@user> or <@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
  	let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1]);
    let type = client.helpers.getGymType(client, message.member) || args[0];

    if(!pUser){
      client.errors.noUser(message);
      return;
    }
    if(!type){
      client.errors.noType(message);
      return;
    }

    if(!client.gymTypes.includes(type.toLowerCase())){
      message.channel.send(`Sorry, but ${type} is not a gym type.`);
      message.react('❌');
      return;
    }

    if(!client.helpers.checkGyms(client, type, message.member, true)){
      message.channel.send("You don't have permission for this action.");
      message.react('❌');
      return;
    }

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

    if(!badges){
      message.channel.send(`${pUser.user.username} has not registered for the gym challenge. They need to use !register [hometown] to sign up.`);
      message.react('❌');
      return;
    }
    
    if(!badges[type.toLowerCase()]){
      badges[type.toLowerCase()] = true;
      badges.count++;
      const prom = badges.save();
      prom.then(() => db.disconnect())
			  .catch(console.error);
      prom.then(() => message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`));
      prom.then(() => message.react('✅'));
      prom.catch(console.error);
      prom.catch((err) => message.react('❌'));
    }else{
      message.channel.send(`${pUser.user.tag} already has the ${type} badge.`);
      message.react('❌');
      return;
    }
  }
}
