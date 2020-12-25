
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
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    //if(message.member.highestRole.comparePositionTo(tomute.highestRole)<=0 && message.author.id !== message.guild.ownerID) return message.reply("Cannot unmute member.").then(r => r.delete({timeout: 5000}));
    if(!tomute.kickable) return message.reply("Cannot unmute member.").then(r => r.delete({timeout: 5000}));

    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);
    if(!muterole){
      return message.channel.send("No \"Timeout\" role")
            .then(m => m.delete({timeout: 5000}))
            .catch(err => {});
    }

    tomute.roles.remove(muterole)
    .then(() => {
      return message.channel.send(`${tomute.user.tag} has been unmuted`)
    })
    .then(m => {
      return m.delete({timeout: 5000});
    })
    .catch(err => message.channel.send("Could not remove role.").then(m => m.delete({timeout: 5000}).catch(err => {})))
  }
}
