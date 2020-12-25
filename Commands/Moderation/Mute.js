const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "mute",
  aliases: [],
  category: "Moderation",
  description: "Mutes a user",
  usage: "<@user>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    if(!tomute.kickable) return message.channel.send("I cant mute them because I don't have permission to kick them").then(m => m.delete({timeout: 5000}))
    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);

    if(!muterole) return message.channel.send("No \"Timeout\" role").then(m => m.delete({timeout: 5000}));

    let mutechannel = message.guild.channels.cache.find(channel => channel.name === client.config.modChannel) || message.channel;
    if(!mutechannel) return message.channel.send("Couldn't find mute channel");

    tomute.roles.add(muterole)
    .then(() => {
      message.channel.send(`${tomute.user.tag} has been muted`).then(m => m.delete({timeout: 5000}));

      let muteEmbed = new MessageEmbed()
      .setDescription("Temp Mute")
      .setColor(client.config.color)
      .addField("Muted User", `${tomute} with ID: ${tomute.id}`)
      .addField("Muted By",`${message.author} with ID: ${message.author.id}`);

      mutechannel.send(muteEmbed);
    })
    .catch(err => message.channel.send("I'm sorry, but I was unable to mute this user.").then(m => m.delete({timeout: 5000}).catch(err => {})));
  }
}
