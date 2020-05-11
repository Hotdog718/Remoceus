const Badges = require("../..//Models/Badges.js")

module.exports = {
  name: "givebadge",
  aliases: ["gb"],
  category: "Gyms",
  description: "Gives a badge to a user",
  usage: "<type> <@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
  	if(message.deletable) message.delete();

  	let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
    let type = args[0];

    if(!pUser) return client.errors.noUser(message);
    if(!type) return client.errors.noType(message);

    if(!client.errors.checkGyms(type, message.member, true)) return message.channel.send("oof.").then(m => m.delete({timeout: 5000}));

    Badges.findOne({
      userID: pUser.id,
      serverID: message.guild.id
    }, (err, badges) => {
      if(err) console.log(err);
      if(!badges){
        message.channel.send(`This user has not registered for the gym challenge, use !register to register.`);
      }else{
        if(!badges[type.toLowerCase()]){
          badges[type.toLowerCase()] = true;
          badges.count++;
          message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`).then(m => m.delete({timeout: 5000}));
          badges.save().catch(err => console.log(err));
        }else{
          message.channel.send(`${pUser.user.tag} already has the ${type} badge.`).then(m => m.delete({timeout: 5000}));
        }
      }
    })
  }
}
