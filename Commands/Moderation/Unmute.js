
module.exports = {
  name: "unmute",
  aliases: [],
  category: "Moderation",
  description: "Unmutes an already muted user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES", {checkOwner: true, checkAdmin: true})) return client.errors.noPerms(message, "Manage Roles");
    //if(message.member.highestRole.comparePositionTo(tomute.highestRole)<=0 && message.author.id !== message.guild.ownerID) return message.reply("Cannot unmute member.").then(r => r.delete({timeout: 5000}));
    if(!tomute.kickable) return message.reply("Cannot unmute member.").then(r => r.delete({timeout: 5000}));

    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);
    if(!muterole){
      return message.channel.send("No \"Timeout\" role")
    }

    tomute.roles.remove(muterole)
                .then(() => message.channel.send(`${tomute.user.tag} has been unmuted`))
                .catch(err => message.channel.send("Could not remove role."));
  }
}
