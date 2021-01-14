
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
      return client.errors.noUser(message);
    }

    if(!message.member.hasPermission("BAN_MEMBERS", {checkOwner: true, checkAdmin: true})){
      return client.errors.noPerms(message, "Ban Members");
    }

    if(!message.guild.me.hasPermission("BAN_MEMBERS", {checkOwner: true, checkAdmin: true})){
      message.react('❌');
      return message.channel.send("Sorry, but I don't have permission to ban members");
    }

    if(toBan.id === message.author.id){
      message.react('❌');
      return message.channle.send("You cannot ban yourself");
    }

    if(toBan.id === client.user.id){
      message.react('❌');
      return message.channel.send("Please don't ban me!");
    }

    if(!toBan.bannable){
      message.react('❌');
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

    const prom = toBan.ban({reason: reason});
    prom.then(() => banChannel.send(banEmbed));
    prom.then(() => message.react('✅'));
    prom.catch(console.error);
    prom.catch((err) => message.react('❌'));
  }
}
