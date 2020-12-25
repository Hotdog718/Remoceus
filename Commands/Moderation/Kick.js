
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  aliases: [],
  category: "Moderation",
  description: "Kicks a user",
  usage: "<@user> <reason>",
  permissions: ["Kick Members"],
  run: async (client, message, args) => {
    if(!args[0]){
      return message.channel.send("You need to mention another user").then(m => m.delete({timeout: 5000}));
    }

    let reason = args.slice(1).join(" ") || "No Reason Given";

    let toKick = message.mentions.members.first();

    if(!toKick){
      return message.channel.send("Could not find user").then(m => m.delete({timeout: 5000}));
    }

    if(!message.member.hasPermission("KICK_MEMBERS", false, true, true)){
      return client.errors.noPerms(message, "Kick Members");
    }

    if(!message.guild.me.hasPermission("KICK_MEMBERS", false, true, true)){
      return message.channel.send("Sorry, but I don't have permission to kick members").then(m => m.delete({timeout: 5000}));
    }

    if(toKick.id === message.author.id){
      return message.channle.send("You cannot kick yourself").then(m => m.delete({timeout: 5000}));
    }

    if(toKick.id === client.user.id){
      return message.channel.send("You cannot kick me");
    }

    if(!toKick.kickable){
      return message.channel.send("I cannot kick this member");
    }

    let kickChannel = message.guild.channels.find(channel => channel.name === client.config.modChannel) || message.channel;

    const kickEmbed = new MessageEmbed()
    .setTitle("Kick Embed")
    .setThumbnail(toKick.user.displayAvatarURL())
    .setColor(client.config.color)
    .addField("Kicked User", `${toKick.user.tag} (${toKick.id})`)
    .addField("Kicked By", `${message.author.tag} (${message.author.id})`);
    if(reason){
      kickEmbed.addField("Reason", reason);
    }

    toKick.kick(reason)
      .then(() =>{
        return kickChannel.send(kickEmbed)
      })
      .catch(err => console.log(err));
  }
}
