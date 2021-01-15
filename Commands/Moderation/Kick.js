
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  aliases: [],
  category: "Moderation",
  description: "Kicks a user",
  usage: "<@user> [reason]",
  permissions: ["Kick Members"],
  run: async (client, message, args) => {
    if(!args[0]){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("You need to mention another user");
    }

    let reason = args.slice(1).join(" ") || "No Reason Given";

    let toKick = message.mentions.members.first();

    if(!toKick){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("Could not find user");
    }

    if(!message.member.hasPermission("KICK_MEMBERS", {checkOwner: true, checkAdmin: true})){
      message.react('❌')
						 .catch(console.error);
      return client.errors.noPerms(message, "Kick Members");
    }

    if(!message.guild.me.hasPermission("KICK_MEMBERS", {checkOwner: true, checkAdmin: true})){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("Sorry, but I don't have permission to kick members");
    }

    if(toKick.id === message.author.id){
      message.react('❌')
						 .catch(console.error);
      return message.channle.send("You cannot kick yourself");
    }

    if(toKick.id === client.user.id){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("You cannot kick me");
    }

    if(!toKick.kickable){
      message.react('❌')
						 .catch(console.error);
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

    const prom = toKick.kick(reason);
    prom.then(() => kickChannel.send(kickEmbed));
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.catch(console.error);
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
