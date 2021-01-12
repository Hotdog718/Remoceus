
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: [],
  category: "Moderation",
  description: "Bans a user",
  usage: "<@user> <reason>",
  permissions: ["Ban Members"],
  run: async (client, message, args) => {
    if(!args[0]){
      return message.channel.send("You need to mention another user");
    }

    let reason = args.slice(1).join(" ") || "No Reason Given";

    let toBan = message.mentions.members.first();

    if(!toBan){
      return message.channel.send("Could not find user");
    }

    if(!message.member.hasPermission("BAN_MEMBERS", {checkOwner: true, checkAdmin: true})){
      return client.errors.noPerms(message, "Ban Members");
    }

    if(!message.guild.me.hasPermission("BAN_MEMBERS", {checkOwner: true, checkAdmin: true})){
      return message.channel.send("Sorry, but I don't have permission to ban members");
    }

    if(toBan.id === message.author.id){
      return message.channle.send("You cannot ban yourself");
    }

    if(toBan.id === client.user.id){
      return message.channel.send("You cannot ban me");
    }

    if(!toBan.bannable){
      return message.channel.send("I cannot ban this member");
    }

    let banChannel = message.guild.channels.cache.find(channel => channel.name === client.config.modChannel) || message.channel;

    const banEmbed = new MessageEmbed()
    .setTitle("Ban Embed")
    .setThumbnail(toBan.user.displayAvatarURL())
    .setColor(client.config.color)
    .addField("Banned User", `${toBan.user.tag} (${toBan.id})`)
    .addField("Banned By", `${message.author.tag} (${message.author.id})`);
    if(reason){
      banEmbed.addField("Reason", reason);
    }

    toBan.ban({reason: reason})
      .then(() =>{
        return banChannel.send(banEmbed)
      })
      .catch(err => console.log(err));
  }
}
