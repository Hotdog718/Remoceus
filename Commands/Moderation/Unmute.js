
module.exports = {
  name: "unmute",
  aliases: [],
  category: "Moderation",
  description: "Unmutes an already muted user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute){
      client.errors.noUser(message);
      return;
    }

    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})){
      client.errors.noPerms(message, "Manage Roles");
      return;
    }

    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);
    if(!muterole){
      message.channel.send("No \"Timeout\" role")
      message.react('❌')
						 .catch(console.error);
      return;
    }

    const prom = tomute.roles.remove(muterole);
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.then(() => message.channel.send(`${tomute.user.tag} has been unmuted`));
    prom.catch(console.error);
    prom.catch((err) => message.channel.send("Could not remove role."));
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
