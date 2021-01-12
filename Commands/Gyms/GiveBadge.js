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

    if(!pUser) return client.errors.noUser(message);
    if(!type) return client.errors.noType(message);

    if(!client.gymTypes.includes(type.toLowerCase())) return message.channel.send(`Sorry, but ${type} is not a gym type.`);

    if(!client.helpers.checkGyms(client, type, message.member, true)) return message.channel.send("You don't have permission for this action.");

    const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const badges = await Badges.findOne({userID: pUser.id, serverID: message.guild.id});

    if(!badges){
      message.channel.send(`${pUser.user.username} has not registered for the gym challenge. They need to use !register [hometown] to sign up.`)
    }else if(!badges[type.toLowerCase()]){
      badges[type.toLowerCase()] = true;
      badges.count++;
      badges.save()
            .then(() => db.disconnect())
            .then(() => message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`))
            .catch(err => console.log(err));
    }else{
      message.channel.send(`${pUser.user.tag} already has the ${type} badge.`);
    }


  }
}
