const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "tempmute",
  aliases: [],
  category: "Moderation",
  description: "Temporarily mutes a user for a set amount of time",
  usage: "<@user> <mute time>",
  permissions: ["Manage Roles"],
  run: async (client, message, args) => {
    let tomute = message.guild.member(message.mentions.users.first());
    if(!tomute) return client.errors.noUser(message);
    if(!message.member.hasPermission("MANAGE_ROLES")) return client.errors.noPerms(message, "Manage Roles");
    if(!tomute.kickable) return message.reply("Cannot mute member.").then(r => r.delete({timeout: 5000}));
    let muterole = message.guild.roles.cache.find(role => role.name === client.config.muteRole);
    if(!muterole) return message.channel.send("No \"Timeout\" role").then(m => m.delete({timeout: 5000}));

    let mutetime = args[1];
    if(!mutetime) return message.reply("You didn't specify a time!").then(r => r.delete({timeout: 5000}));

    tomute.roles.add(muterole)
    .then(() => {
      message.channel.send(`${tomute.user.tag} has been muted for ${ms(ms(mutetime))}`).then(m => m.delete({timeout: 5000}));

      let muteEmbed = new MessageEmbed()
      .setDescription("Temp Mute")
      .setColor(client.config.color)
      .addField("Muted User", `${tomute.user.tag} with ID: ${tomute.id}`)
      .addField("Muted By",`${message.author.tag} with ID: ${message.author.id}`)
      .addField("Muted for", mutetime);

      let mutechannel = message.guild.channels.cache.find(channel => channel.name === client.config.modChannel) || message.channel;
      if(!mutechannel) return message.channel.send("Couldn't find mute channel");

      mutechannel.send(muteEmbed).then(m => {
        setTimeout(function(){
          tomute.roles.remove(muterole)
          .then(() => {
            message.channel.send(`${tomute.user.tag} has been unmuted!`).then(m => m.delete({timeout: 5000}).catch(err => {}));
          })
          .catch(err => message.channel.send("I couldn't unmute them").then(m => m.delete({timeout: 5000}).catch(err => {})))
        }, ms(mutetime));
      })
      .catch(err => {});
    })
  }
}
