
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: [],
  category: "Moderation",
  description: "Bans a user",
  usage: "<@user> [reason]",
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
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("Sorry, but I don't have permission to ban members");
    }

    if(toBan.id === message.author.id){
      message.react('❌')
						 .catch(console.error);
      return message.channle.send("You cannot ban yourself");
    }

    if(toBan.id === client.user.id){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("Please don't ban me!");
    }

    if(!toBan.bannable){
      message.react('❌')
						 .catch(console.error);
      return message.channel.send("I cannot ban this member");
    }

    const prom = toBan.ban({reason: reason});
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.catch(console.error);
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
