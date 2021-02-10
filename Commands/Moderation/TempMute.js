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
      message.channel.send("No \"Timeout\" role");
      message.react('❌')
						 .catch(console.error);
      return;
    }

    let mutetime = args[1];
    if(!mutetime){
      message.reply("You didn't specify a time!");
      message.react('❌')
						 .catch(console.error);
      return;
    }
    
    let muteEmbed = new MessageEmbed()
    .setDescription("Temp Mute")
    .setColor(client.config.color)
    .addField("Muted User", `${tomute.user.tag} with ID: ${tomute.id}`)
    .addField("Muted By",`${message.author.tag} with ID: ${message.author.id}`)
    .addField("Muted for", mutetime);    
    
    const prom = tomute.roles.add(muterole);
    prom.then(() => message.react('✅'))
				.catch(console.error);
    prom.then(() => message.channel.send(`${tomute.user.tag} has been muted for ${ms(ms(mutetime))}`))
    prom.then(() => message.guild.channels.cache.find(channel => channel.name === client.config.logsChannel) || message.channel)
        .then((mutechannel) => mutechannel.send(muteEmbed))
        .catch(console.error);
    prom.then(m => {
      setTimeout(function(){
        tomute.roles.remove(muterole)
        .then(() => message.channel.send(`${tomute.user.tag} has been unmuted!`))
        .catch(console.error);
      }, ms(mutetime));
    });
    prom.catch(console.error);
    prom.catch((err) => message.react('❌'))
				.catch(console.error);
  }
}
