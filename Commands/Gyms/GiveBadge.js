module.exports = {
  name: "givebadge",
  aliases: ["gb"],
  category: "Gyms",
  description: "Gives a badge to a user, usage depends on roles of user, if user has a gym leader role, just use <@user>, if moderator, use <type> <@user>",
  usage: "<type> <@user> or <@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
  	let pUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[1]);
    let type = args[0];
    
    const gymTypes = Object.keys(client.config.gymTypes);
    if(!gymTypes.includes(type)){
      type = client.helpers.getGymType(client, message.member);
    }

    if(!pUser){
      client.errors.noUser(message);
      return;
    }
    if(!type){
      client.errors.noType(message);
      return;
    }

    if(!gymTypes.includes(type.toLowerCase())){
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
    
    try{
      await client.badges.giveBadge(pUser.id, message.guild.id, type);
      message.channel.send(`${message.author.tag} has given ${pUser.user.tag} the ${type.toLowerCase()} badge!`);
      message.react('✅')
      .catch(console.error);
    }catch(err){
      if(err === 'User has badge'){
        message.channel.send(`${pUser.user.tag} already has the ${type.toLowerCase()} badge.`);
        message.react('❌')
        .catch(console.error);
      }else{
        message.channel.send('This user is not registered for the gym challenge, use !register [hometown] to sign up!');
        message.react('❌')
        .catch(console.error);
      }
    }
  }
}
