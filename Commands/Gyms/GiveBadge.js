const Badges = require("../..//Models/Badges.js")

module.exports = {
  name: "givebadge",
  aliases: ["gb"],
  category: "Gyms",
  description: "Gives a badge to a user",
  usage: "<type> <@user>",
  permissions: [],
  run: async (client, message, args) => {
	if(message.deletable) message.delete();

	let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
    let type = args[0];

    if(!pUser) return client.errors.noUser(message);
    if(!type) return client.errors.noType(message);

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
          newBadges[type.toLowerCase()] = true;
          newBadges.count = 1;
          message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`).then(m => m.delete(5000));
          newBadges.save().catch(err => console.log(err));
        }else{
          if(!badges[type.toLowerCase()]){
            badges[type.toLowerCase()] = true;
            badges.count++;
            message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`).then(m => m.delete(5000));
            badges.save().catch(err => console.log(err));
          }else{
            message.channel.send(`${pUser.user.tag} already has the ${type} badge.`).then(m => m.delete(5000));
          }

        }
      })

    }
    else {
      return message.channel.send("oof.").then(m => m.delete(5000));
    }
  }
}
