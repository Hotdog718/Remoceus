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
      message.react('❌')
						 .catch(console.error);
      return;
    }

    if(!client.helpers.checkGyms(client, type, message.member, true)){
      message.channel.send("You don't have permission for this action.");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    // const db = await mongoose.connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const badges = await client.badges.getBadges(pUser.id, message.guild.id);

    if(!badges){
      message.channel.send(`${pUser.user.username} has not registered for the gym challenge. They need to use !register [hometown] to sign up.`);
      message.react('❌')
						 .catch(console.error);
      return;
    }
    
    if(!badges[type.toLowerCase()]){
      await client.badges.giveBadge(pUser.id, message.guild.id, type);
      message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`);
      message.react('✅')
      .catch(console.error);
    }else{
      message.channel.send(`${pUser.user.tag} already has the ${type} badge.`);
      message.react('❌')
      .catch(console.error);
      return;
    }
  }
}
